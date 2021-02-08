import { Action, BookingRecord } from '@triton/common';
import {
  MusbookingServiceId,
  Order,
  OrderStatus,
} from '@triton/musbooking-common';

export const musbookingStatusToAction = (status: OrderStatus): Action => {
  switch (status) {
    case 11:
      return 'DELETE';
    case 1:
      return 'CREATE';
    default:
      return 'UNKNOWN';
  }
};

export const notAddedViaApi = (item: Order) => item.sourceType !== 6;

export const musbookingOrderToRecord = (item: Order): BookingRecord<Order> => ({
  origin: MusbookingServiceId,
  internalId: item.id,
  externalId: null,
  date: new Date(),
  completed: false,
  action: musbookingStatusToAction(item.status),
  source: item,
  error: false,
  errorMessage: null,
});
