import {
  dateRangeToHours,
  getResponseData,
  musbookingOrderToYclientsRecord,
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
      const yclients: YClientsRecord = {
        staff_id: 1233780,
        seance_length: 3,
        save_if_busy: false,
        send_sms: false,
        services: [],
        datetime: '2021-02-03T18:00:00',
        client: {
          name: 'Test',
          email: 'email@domain.com',
          phone: '+70000000000',
        },
        comment: 'Comment',
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
        seance_length: 3,
        save_if_busy: false,
        send_sms: false,
        services: [],
        datetime: '2021-02-03T18:00:00',
        client: {
          phone: '+70000000000',
          name: 'Клиент MUSBooking',
          email: 'unknown@email.com',
        },
        comment: 'Перенесено из MUSBooking',
      };

      expect(musbookingOrderToYclientsRecord(musbooking)).toEqual(yclients);
    });
  });
});
