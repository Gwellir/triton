import { Action, BookingRecord } from '@triton/common';
import {
  WebHookAction,
  WebHookStatus,
  YClientsRecord,
  YClientsServiceId,
} from '@triton/yclients-common';

export const yclientsStatusToAction = <T extends WebHookStatus>(
  status: T
): Action => {
  return status.toUpperCase() as Action;
};

export const yclientsItemToRecord = (
  item: WebHookAction
): BookingRecord<YClientsRecord> => ({
  origin: YClientsServiceId,
  action: yclientsStatusToAction(item.status),
  internalId: item.data.id,
  externalId: null,
  source: item.data,
  date: new Date(),
  completed: false,
  error: false,
  errorMessage: null,
});
