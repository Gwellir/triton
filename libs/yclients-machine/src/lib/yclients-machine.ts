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
        log: (context, event) => console.log(event.type, context, event.data),
      },
      guards: {
        isEmpty: (_, event) => event.data.length === 0,
        isNotEmpty: (_, event) => event.data.length > 0,
      },
      delays: {
        CHECK_QUEUE_DELAY: 30000, // every 30 seconds
      },
      services: {
        saveRecordsService: (_, event) =>
          db.create(yclientsItemToRecord(event.data)),
        getPendingItemsService: () => db.findPendingItems(YClientsServiceId),
        syncService: async (context, event) => {
          for (const item of event.data as BookingDocument<Order>[]) {
            try {
              if (item.action === 'CREATE') {
                const booking = musbookingOrderToYclientsRecord(item.source);

                const response = await api.create(
                  context.token,
                  context.userToken,
                  booking
                );

                await db.markCompleted(item._id, response.id);

                return;
              }

              if (item.action === 'DELETE') {
                const record = await db.findPreviouslyCreatedItem(
                  YClientsServiceId,
                  item.source.id
                );

                if (record === null) {
                  return;
                }

                await api.remove(
                  context.token,
                  context.userToken,
                  record.internalId as YClientsId
                );

                await db.markCompleted(item._id, record.id);
              }
            } catch (err) {
              await db.markCompletedWithError(item._id, err.message);
            }
          }
        },
      },
    }
  );
