export type MusbookingId = string;

export const MusbookingServiceId = 'musbooking';

export enum OrderStatus {
  UNKNOWN = 0,
  CREATE = 1,
  CLOSE = 10,
  CANCEL = 11,
}

export type Order = {
  id: MusbookingId;
  dateFrom: string;
  dateTo: string;
  status: OrderStatus;
  roomId: string;
  sourceType: number;
  client: string;
  phone: string | null;
  email: string | null;
  items: Record<string, unknown>[];
  comment: string | null;
  promo: string | null;
  totalPays: number;
  totalOrder: number;
  forfeit: number;
  cancelForfeit: number;
  paidForfeit: number;
  totalPayment: number;
  totalSum: number;
};

export type OrderCreateOptions = {
  date: string;
  room: string;
  hours: number;
};

export type OrderUpdateOptions = {
  id: string;
  status: OrderStatus;
};
