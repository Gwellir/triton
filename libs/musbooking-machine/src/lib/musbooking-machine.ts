import * as xstate from 'xstate';
import { yclientsRecordToMusbookingOrder } from '@triton/common';
import * as db from '@triton/db';
import { BookingDocument } from '@triton/db';
import * as api from '@triton/musbooking-api';
import {
  musbookingOrderToRecord,
  notAddedViaApi,
} from '@triton/musbooking-utils';
import {
  MusbookingId,
  MusbookingServiceId,
  OrderStatus,
} from '@triton/musbooking-common';
import { YClientsRecord } from '@triton/yclients-common';

interface Context {
  token: string | null;
  expirationDate: Date | null;
  lastCheck: Date;
}

interface Schema {
  states: {
    auth: {
      states: {
        login: Record<string, unknown>;
        error: Record<string, unknown>;
      };
    };
    ready: {
      states: {
        save: {
          states: {
            idle: Record<string, unknown>;
            check: Record<string, unknown>;
            sync: Record<string, unknown>;
          };
        };
        sync: {
          states: {
            idle: Record<string, unknown>;
            check: Record<string, unknown>;
            sync: Record<string, unknown>;
            error: Record<string, unknown>;
          };
        };
      };
    };
  };
}

export const createMachine = () =>
  xstate.Machine<Context, Schema, xstate.AnyEventObject>(
    {
      id: MusbookingServiceId,
      initial: 'auth',
      context: {
        token: null,
        expirationDate: null,
        lastCheck: new Date(),
      },
      states: {
        auth: {
          initial: 'login',
          states: {
            login: {
              invoke: {
                src: 'loginService',
                onDone: {
                  target: `#${MusbookingServiceId}.ready`,
                  actions: ['updateToken', 'log'],
                },
                onError: {
                  target: 'error',
                  actions: ['log'],
                },
              },
            },
            error: {
              after: {
                RETRY_AUTH_DELAY: 'login',
              },
            },
          },
        },
        ready: {
          type: 'parallel',
          states: {
            save: {
              initial: 'check',
              states: {
                idle: {
                  after: {
                    CHECK_QUEUE_DELAY: {
                      target: 'check',
                    },
                  },
                },
                check: {
                  invoke: {
                    src: 'getPendingItemsService',
                    onDone: [
                      {
                        target: 'sync',
                        cond: { type: 'isNotEmpty' },
                        actions: ['log'],
                      },
                      {
                        target: 'idle',
                        cond: { type: 'isEmpty' },
                        actions: ['log'],
                      },
                    ],
                    onError: {
                      target: ['idle'],
                      actions: ['log'],
                    },
                  },
                },
                sync: {
                  invoke: {
                    src: 'syncService',
                    onDone: {
                      target: 'idle',
                      actions: ['log'],
                    },
                    onError: {
                      target: 'idle',
                      actions: ['log'],
                    },
                  },
                },
              },
            },
            sync: {
              initial: 'idle',
              states: {
                idle: {
                  after: {
                    SYNC_DELAY: [
                      {
                        target: 'check',
                        cond: { type: 'tokenValid' },
                      },
                      {
                        target: `#${MusbookingServiceId}.auth`,
                        cond: { type: 'tokenExpired' },
                      },
                    ],
                  },
                },
                check: {
                  invoke: {
                    src: 'getUpdatesService',
                    onDone: [
                      {
                        target: 'sync',
                        actions: ['log'],
                        cond: { type: 'isNotEmpty' },
                      },
                      {
                        target: 'idle',
                        actions: ['updateLastCheck', 'log'],
                        cond: { type: 'isEmpty' },
                      },
                    ],
                    onError: {
                      target: 'error',
                      actions: ['log'],
                    },
                  },
                },
                sync: {
                  invoke: {
                    src: 'saveRecordsService',
                    onDone: {
                      target: 'idle',
                      actions: ['updateLastCheck', 'log'],
                    },
                    onError: {
                      target: 'error',
                      actions: ['log'],
                    },
                  },
                },
                error: {
                  after: {
                    RETRY_SYNC_DELAY: 'check',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        log: (context, event) => console.log(event.type, context),
        updateToken: xstate.assign({
          token: (_, event) => event.data.token,
          expirationDate: () => {
            const date = new Date();
            date.setHours(date.getHours() + 10);

            return date;
          },
        }),
        updateLastCheck: xstate.assign({
          lastCheck: () => new Date(),
        }),
      },
      services: {
        loginService: () =>
          api.login(
            process.env.MUSBOOKING_LOGIN || '',
            process.env.MUSBOOKING_PASSWORD || ''
          ),
        getPendingItemsService: () => db.findPendingItems(MusbookingServiceId),
        getUpdatesService: (context) =>
          api.syncList(context.token, context.lastCheck),
        saveRecordsService: (context, event) =>
          db.createMultiple(
            event.data.filter(notAddedViaApi).map(musbookingOrderToRecord)
          ),
        syncService: async (context, event) => {
          for (const item of event.data as BookingDocument<YClientsRecord>[]) {
            try {
              if (item.action === 'CREATE') {
                const booking = yclientsRecordToMusbookingOrder(item.source);
                console.log('CREATE', booking);

                const { id } = await api.syncAdd(context.token, booking);

                const status = { id, status: OrderStatus.UNKNOWN };
                await api.syncUpdate(context.token, status);

                await db.markCompleted(item._id, id);
              } else if (item.action === 'DELETE') {
                const recordId = await db.findPreviouslyCreatedItemId(
                  MusbookingServiceId,
                  item.source.id
                );

                if (recordId !== null) {
                  console.log('DELETE', recordId);

                  const status = {
                    id: recordId as MusbookingId,
                    status: OrderStatus.CANCEL,
                  };
                  await api.syncUpdate(context.token, status);

                  await db.markCompleted(item._id, recordId);
                }
              } else if (item.action === 'UPDATE') {
                const recordId = await db.findPreviouslyCreatedItemId(
                  MusbookingServiceId,
                  item.source.id
                );

                if (recordId !== null) {
                  console.log('UPDATE', recordId);

                  // Cancel previously created booking
                  const cancelStatus = {
                    id: recordId as MusbookingId,
                    status: OrderStatus.CANCEL,
                  };
                  await api.syncUpdate(context.token, cancelStatus);

                  // Create new booking from update record if the update is not
                  // about the item getting deleted
                  if (!item.source.deleted) {
                    const booking = yclientsRecordToMusbookingOrder(item.source);

                    const { id } = await api.syncAdd(context.token, booking);

                    const reserveStatus = { id, status: OrderStatus.UNKNOWN };

                    await api.syncUpdate(context.token, reserveStatus);

                    // Update external id for original created record
                    await db.markCompleted(item._id, id);
                  } else {
                    // Sometimes YCL item removal webhook is received as an UPDATE with 
                    // data.deleted status (or both entries at once)
                    await db.markCompleted(item._id, recordId);
                  }
                }
              }
            } catch (err) {
              const message = err.response
                ? JSON.stringify(err.response.data)
                : err.message;
              console.log('ERROR', message);
              await db.markCompletedWithError(item._id, message);
            }
          }
        },
      },
      guards: {
        tokenValid: (context) =>
          context.expirationDate.getTime() > new Date().getTime(),
        tokenExpired: (context) =>
          context.expirationDate.getTime() <= new Date().getTime(),
        isEmpty: (_, event) => event.data.length === 0,
        isNotEmpty: (_, event) => event.data.length > 0,
      },
      delays: {
        RETRY_AUTH_DELAY: () => 10000, // every 10 seconds
        RETRY_SYNC_DELAY: () => 5000, // every 5 seconds
        SYNC_DELAY: () => 30000, // every 30 seconds
        CHECK_QUEUE_DELAY: () => 30000, // every 30 seconds
      },
    }
  );
