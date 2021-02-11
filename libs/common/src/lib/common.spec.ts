import {
  dateRangeToHours,
  getResponseData,
  musbookingOrderToYclientsRecord,
  musbookingOrderToYclientsService,
  musbookingRoomIdToYclientsRoomId,
  yclientsRecordToMusbookingOrder,
  yclientsRoomIdToMusbookingRoomId,
} from './common';
import { YClientsRecord } from '@triton/yclients-common';
import { Order, OrderCreateOptions } from '@triton/musbooking-common';

describe('common', () => {
  describe('dateRangeToHours', () => {
    it('should get the number of hours between two dates', () => {
      const from = new Date(2021, 1, 1, 10);
      const to = new Date(2021, 1, 1, 12);

      expect(dateRangeToHours(from, to)).toEqual(2);
    });
  });
  describe('getResponseData', () => {
    it('should extract `data` property from response', () => {
      const response = {
        data: 'Test',
        config: {},
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      expect(getResponseData(response)).toEqual('Test');
    });
  });
  describe('yclientsRoomIdToMusbookingRoomId', () => {
    it('should map yclients room to musbooking room', () => {
      expect(yclientsRoomIdToMusbookingRoomId(1233780)).toEqual(
        'ec7e7c14-ad65-44bb-a53e-4ac853d3bc51'
      );
      expect(yclientsRoomIdToMusbookingRoomId(1273231)).toEqual(
        '83ddd561-605b-4af1-8f1d-1c244594799b'
      );
      expect(yclientsRoomIdToMusbookingRoomId(1273259)).toEqual(
        '4290d922-1043-4d8a-acab-7375bb69d1cd'
      );
      expect(yclientsRoomIdToMusbookingRoomId(42)).toEqual(null);
    });
  });
  describe('musbookingRoomIdToYclientsRoomId', () => {
    it('should map musbooking room to yclients room', () => {
      expect(
        musbookingRoomIdToYclientsRoomId('ec7e7c14-ad65-44bb-a53e-4ac853d3bc51')
      ).toEqual(1233780);
      expect(
        musbookingRoomIdToYclientsRoomId('83ddd561-605b-4af1-8f1d-1c244594799b')
      ).toEqual(1273231);
      expect(
        musbookingRoomIdToYclientsRoomId('4290d922-1043-4d8a-acab-7375bb69d1cd')
      ).toEqual(1273259);
      expect(musbookingRoomIdToYclientsRoomId('unknown')).toEqual(null);
    });
  });
  describe('yclientsRecordToMusbookingOrder', () => {
    it('converts yclients record to musbooking order', () => {
      const date = new Date(2021, 1, 1, 12, 0, 0, 0).toISOString();

      const yclients: YClientsRecord = {
        id: 123,
        staff_id: 1233780,
        seance_length: 3600,
        services: [],
        client: {
          name: 'Test',
          phone: '911',
          email: 'some@email.com',
        },
        save_if_busy: false,
        send_sms: false,
        comment: '',
        datetime: date,
        custom_color: '6c6c6c',
      };
      const musbooking: OrderCreateOptions = {
        room: 'ec7e7c14-ad65-44bb-a53e-4ac853d3bc51',
        hours: 1,
        date: date,
      };

      expect(yclientsRecordToMusbookingOrder(yclients)).toEqual(musbooking);
    });
  });
  describe('musbookingOrderToYclientsRecord', () => {
    it('converts musbooking order to yclients record', () => {
      const musbooking: Order = {
        id: 'dcc4d2e8-e31b-45d6-850f-1912e446a829',
        dateFrom: '2021-02-03T18:00:00',
        dateTo: '2021-02-03T21:00:00',
        status: 1,
        roomId: 'ec7e7c14-ad65-44bb-a53e-4ac853d3bc51',
        sourceType: 0,
        client: 'Test',
        phone: '0000000000',
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
      const yclients: YClientsRecord = {
        staff_id: 1233780,
        seance_length: 10800,
        save_if_busy: false,
        send_sms: false,
        services: [
          {
            amount: 1,
            cost: 1350,
            discount: 0,
            first_cost: 1350,
            id: 6671823,
          },
        ],
        datetime: '2021-02-03T18:00:00+03:00',
        client: {
          name: 'Test',
          email: 'email@domain.com',
          phone: '+70000000000',
        },
        comment: 'Comment',
        custom_color: '6c6c6c',
      };

      expect(musbookingOrderToYclientsRecord(musbooking)).toEqual(yclients);
    });
    it('converts musbooking order to yclients record with missing fields', () => {
      const musbooking: Order = {
        id: 'dcc4d2e8-e31b-45d6-850f-1912e446a829',
        dateFrom: '2021-02-03T18:00:00',
        dateTo: '2021-02-03T21:00:00',
        status: 1,
        roomId: 'ec7e7c14-ad65-44bb-a53e-4ac853d3bc51',
        sourceType: 0,
        client: null,
        phone: null,
        email: null,
        items: [],
        comment: null,
        promo: null,
        totalPays: 0,
        totalOrder: 1350,
        forfeit: 0,
        cancelForfeit: 0,
        paidForfeit: 0,
        totalPayment: 1350,
        totalSum: 1350,
      };
      const yclients: YClientsRecord = {
        staff_id: 1233780,
        seance_length: 10800,
        save_if_busy: false,
        send_sms: false,
        services: [
          {
            amount: 1,
            cost: 1350,
            discount: 0,
            first_cost: 1350,
            id: 6671823,
          },
        ],
        datetime: '2021-02-03T18:00:00+03:00',
        client: {
          phone: '+70000000000',
          name: 'Клиент MUSBooking',
          email: 'unknown@email.com',
        },
        comment: 'Перенесено из MUSBooking',
        custom_color: '6c6c6c',
      };

      expect(musbookingOrderToYclientsRecord(musbooking)).toEqual(yclients);
    });
  });
  describe('musbookingOrderToYclientsServices', () => {
    test.each`
      roomId     | hours | price
      ${1233780} | ${1}  | ${225}
      ${1233780} | ${1}  | ${450}
      ${1233780} | ${2}  | ${450 * 2}
      ${1233780} | ${3}  | ${450 * 3}
      ${1233780} | ${4}  | ${450 * 4}
      ${1233780} | ${5}  | ${450 * 5}
      ${1233780} | ${6}  | ${450 * 6}
      ${1233780} | ${7}  | ${2700}
      ${1273231} | ${1}  | ${450}
      ${1273231} | ${2}  | ${450 * 2}
      ${1273231} | ${3}  | ${450 * 3}
      ${1273231} | ${4}  | ${450 * 4}
      ${1273231} | ${5}  | ${450 * 5}
      ${1273231} | ${6}  | ${450 * 6}
      ${1273231} | ${7}  | ${2700}
      ${1273259} | ${1}  | ${250}
      ${1273259} | ${1}  | ${500}
      ${1273259} | ${2}  | ${500 * 2}
      ${1273259} | ${3}  | ${500 * 3}
      ${1273259} | ${4}  | ${500 * 4}
      ${1273259} | ${5}  | ${500 * 5}
      ${1273259} | ${6}  | ${500 * 6}
      ${1273259} | ${7}  | ${3000}
    `(
      'find service by room id ($roomId), payment sum ($price) and seance duration ($hours hours)',
      ({ roomId, price, hours }) => {
        const found = musbookingOrderToYclientsService(
          price,
          roomId,
          hours * 3600
        );
        expect(found).not.toBeNull();
      }
    );
  });
});
