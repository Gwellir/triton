import { AxiosResponse } from 'axios';
import {
  MusbookingId,
  Order,
  OrderCreateOptions,
} from '@triton/musbooking-common';
import { YClientsId, YClientsRecord } from '@triton/yclients-common';

type RoomMapping = {
  name: string;
  musbookingId: MusbookingId;
  yclientsId: YClientsId;
};

export type Id = MusbookingId | YClientsId;

export type Action = 'CREATE' | 'UPDATE' | 'DELETE' | 'UNKNOWN';

export type BookingRecord<T = YClientsRecord | Order> = {
  date: Date;
  action: Action;
  origin: string;
  internalId: Id | null;
  externalId: Id;
  completed: boolean;
  source: T;
  error: boolean;
  errorMessage: string | null;
};

const config: { rooms: Array<RoomMapping> } = {
  rooms: [
    {
      name: 'КВАРТА',
      musbookingId: 'ec7e7c14-ad65-44bb-a53e-4ac853d3bc51',
      yclientsId: 1233780,
    },
    {
      name: 'КВИНТА',
      musbookingId: '83ddd561-605b-4af1-8f1d-1c244594799b',
      yclientsId: 1273231,
    },
    {
      name: 'ТРИТОН',
      musbookingId: '4290d922-1043-4d8a-acab-7375bb69d1cd',
      yclientsId: 1273259,
    },
  ],
};

export const getResponseData = <T>(response: AxiosResponse<T>): T =>
  response.data;

export const dateRangeToHours = (start: Date, end: Date): number =>
  Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));

export const yclientsRoomIdToMusbookingRoomId = (
  id: YClientsId
): MusbookingId | null => {
  const found = config.rooms.find((room) => room.yclientsId === id);
  return found ? found.musbookingId : null;
};

export const musbookingRoomIdToYclientsRoomId = (
  id: MusbookingId
): YClientsId | null => {
  const found = config.rooms.find((room) => room.musbookingId === id);
  return found ? found.yclientsId : null;
};

export const yclientsRecordToMusbookingOrder = (
  item: YClientsRecord
): OrderCreateOptions => ({
  room: yclientsRoomIdToMusbookingRoomId(item.staff_id),
  date: new Date(item.datetime).toISOString(),
  hours: item.seance_length / 3600,
});

export const musbookingOrderToYclientsRecord = (
  item: Order
): YClientsRecord => ({
  staff_id: musbookingRoomIdToYclientsRoomId(item.roomId),
  services: [
    {
      id: 6671791,
      cost: item.totalSum,
      first_cost: item.totalSum,
      discount: 0,
      amount: 1,
    },
  ], // Try empty services TODO Extract all services and map them to hours
  client: {
    phone: item.phone || '+70000000000',
    name: item.client || 'Клиент MUSBooking',
    email: item.email || 'unknown@email.com',
  },
  datetime: new Date(item.dateFrom).toISOString(),
  seance_length:
    dateRangeToHours(new Date(item.dateFrom), new Date(item.dateTo)) * 3600, // In seconds
  save_if_busy: false,
  send_sms: false,
  comment: `${item.comment || 'Перенесено из MUSBooking'}`,
});
