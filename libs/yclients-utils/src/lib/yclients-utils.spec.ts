import { yclientsItemToRecord, yclientsStatusToAction } from './yclients-utils';
import {
  WebHookAction,
  YClientsRecord,
  YClientsServiceId,
} from '@triton/yclients-common';
import { BookingRecord } from '@triton/common';

describe('yclientsUtils', () => {
  it('should map yclients status to action', () => {
    expect(yclientsStatusToAction('create')).toEqual('CREATE');
    expect(yclientsStatusToAction('update')).toEqual('UPDATE');
    expect(yclientsStatusToAction('delete')).toEqual('DELETE');
  });
  it('converts yclients record to db record', () => {
    const now = new Date();

    const item: YClientsRecord = {
      id: 123,
      staff_id: 1,
      seance_length: 1,
      services: [],
      client: {
        name: 'Test',
        phone: '911',
        email: 'some@email.com',
      },
      save_if_busy: false,
      send_sms: false,
      comment: '',
      datetime: '2021-01-01 12:00:00',
    };

    const action: WebHookAction = {
      status: 'create',
      data: item,
    };

    const record: BookingRecord<YClientsRecord> = {
      action: 'CREATE',
      origin: YClientsServiceId,
      internalId: item.id,
      externalId: null,
      date: now,
      completed: false,
      source: item,
      error: false,
      errorMessage: null,
    };

    expect(yclientsItemToRecord(action)).toEqual(record);
  });
});
