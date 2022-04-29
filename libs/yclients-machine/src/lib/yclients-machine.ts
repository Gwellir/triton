import * as xstate from 'xstate';
import * as db from '@triton/db';
import { BookingDocument } from '@triton/db';
import * as api from '@triton/yclients-api';
import {
  WebHookAction,
  YClientsId,
  YClientsServiceId,
} from '@triton/yclients-common';
import { yclientsItemToRecord } from '@triton/yclients-utils';
import { Order } from '@triton/musbooking-common';
import { musbookingOrderToYclientsRecord } from '@triton/common';

interface Context {
  token: string;
  userToken: string;
}

interface Schema {
  states: {
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
            sync: Record<string, unknown>;
          };
        };
      };
    };
  };
}

type Event = { type: 'WEB_HOOK'; data: WebHookAction } | xstate.AnyEventObject;

export const createMachine = () =>
  xstate.Machine<Context, Schema, Event>(
    {
      id: YClientsServiceId,
      initial: 'ready',
      context: {
        token: process.env.YCLIENTS_TOKEN,
        userToken: process.env.YCLIENTS_USER_TOKEN,
      },
      states: {
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
                  on: {
                    WEB_HOOK: {
                      target: 'sync',
                      actions: ['log'],
                    },
                  },
                },
                sync: {
                  invoke: {
                    src: 'saveRecordsService',
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
          },
        },
      },
    },
    {
      actions: {
        log: (context, event) => console.log(event.type, context),
      },
      guards: {
        isEmpty: (_, event) => event.data.length === 0,
        isNotEmpty: (_, event) => event.data.length > 0,
      },
      delays: {
        CHECK_QUEUE_DELAY: 30000, // every 30 seconds
      },
      services: {
        saveRecordsService: async (_, event) => {
          const record = yclientsItemToRecord(event.data);

          const exists = await db.exists(record);

          if (exists) {
            return;
          }

          return db.create(yclientsItemToRecord(event.data));
        },
        getPendingItemsService: () => db.findPendingItems(YClientsServiceId),
        syncService: async (context, event) => {
          for (const item of event.data as BookingDocument<Order>[]) {
            try {
              if (item.action === 'CREATE') {
                const booking = musbookingOrderToYclientsRecord(item.source);
                console.log('CREATE', booking);

                const response = await api.create(
                  context.token,
                  context.userToken,
                  booking
                );

                await db.markCompleted(item._id, response.data.id);
              } else if (item.action === 'DELETE') {
                const recordId = await db.findPreviouslyCreatedItemId(
                  YClientsServiceId,
                  item.source.id
                );

                if (recordId !== null) {
                  const hasYClientsUpdate = await db.checkYClientsUpdate(
                    item.source.id,
                    recordId,
                  );
                  if (!hasYClientsUpdate) {
                    console.log('DELETE', recordId);
                    await api.remove(
                      context.token,
                      context.userToken,
                      recordId as YClientsId
                    );

                    await db.markCompleted(item._id, recordId);
                  } else {
                    console.log('ECHO REMOVAL BLOCKED!', recordId)
                    await db.markCompletedWithError(item._id, "ECHO REMOVAL ATTEMPT")
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
    }
  );
