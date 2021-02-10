import {
  musbookingOrderToRecord,
  musbookingStatusToAction,
} from './musbooking-utils';
import { MusbookingServiceId, Order } from '@triton/musbooking-common';
import { BookingRecord } from '@triton/common';

describe('musbookingUtils', () => {
  describe('musbookingStatusToAction', () => {
    it('maps musbooking order status to action', () => {
      expect(musbookingStatusToAction(1)).toEqual('CREATE');
      expect(musbookingStatusToAction(11)).toEqual('DELETE');
      expect(musbookingStatusToAction(42)).toEqual('UNKNOWN');
    });
  });
  describe('musbookingOrderToRecord', () => {
    it('converts musbooking order to db record', () => {
      const now = new Date();

      const order: Order = {
        id: 'dcc4d2e8-e31b-45d6-850f-1912e446a829',
        dateFrom: '2021-02-03T18:00:00',
        dateTo: '2021-02-03T21:00:00',
        status: 1,
        roomId: '83ddd561-605b-4af1-8f1d-1c244594799b',
        sourceType: 0,
        client: 'Test',
        phone: '+70000000000',
        email: 'email@domain.com',
        items: [],
        comment: 'Comment',
        promo: null,
        totalPays: 0,
        totalOrder: 1350,
        forfeit: 0,
        cancelForfeit: 0,
        paidForfeit: 0,
        totalPayment: 1350,
        totalSum: 1350,
      };

      const record: BookingRecord<Order> = {
        action: 'CREATE',
        origin: MusbookingServiceId,
        internalId: order.id,
        externalId: null,
        date: now,
        completed: false,
        source: order,
        error: false,
        errorMessage: null,
      };

      expect(musbookingOrderToRecord(order)).toEqual(record);
    });
  });
});
