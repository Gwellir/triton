import { AxiosResponse } from 'axios';
import formatISO from 'date-fns/formatISO';
import {
  MusbookingId,
  Order,
  OrderCreateOptions,
} from '@triton/musbooking-common';
import {
  YClientsId,
  YClientsRecord,
  YClientsService,
} from '@triton/yclients-common';

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

const config: {
  rooms: Array<RoomMapping>;
  services: Array<YClientsService>;
} = {
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
  services: [
    {
      id: 6671791,
      salon_service_id: 7392469,
      title: 'Аренда класса 1 час',
      category_id: 6671669,
      price_min: 450,
      price_max: 450,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 3600,
          },
          {
            id: 1273231,
            seance_length: 3600,
          },
          {
            id: 1273259,
            seance_length: 3600,
          },
        ],
      ],
    },
    {
      id: 6671818,
      salon_service_id: 7392514,
      title: 'Аренда класса 2 часа',
      category_id: 6671669,
      price_min: 900,
      price_max: 900,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 7200,
          },
          {
            id: 1273231,
            seance_length: 7200,
          },
          {
            id: 1273259,
            seance_length: 7200,
          },
        ],
      ],
    },
    {
      id: 6671823,
      salon_service_id: 7392519,
      title: 'Аренда класса 3 часа',
      category_id: 6671669,
      price_min: 1350,
      price_max: 1350,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 10800,
          },
          {
            id: 1273231,
            seance_length: 10800,
          },
          {
            id: 1273259,
            seance_length: 10800,
          },
        ],
      ],
    },
    {
      id: 6671837,
      salon_service_id: 7392533,
      title: 'Аренда класса 4 часа',
      category_id: 6671669,
      price_min: 1800,
      price_max: 1800,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 14400,
          },
          {
            id: 1273231,
            seance_length: 14400,
          },
          {
            id: 1273259,
            seance_length: 14400,
          },
        ],
      ],
    },
    {
      id: 6671841,
      salon_service_id: 7392537,
      title: 'Аренда класса 1 час',
      category_id: 6671677,
      price_min: 450,
      price_max: 450,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 3600,
          },
          {
            id: 1273231,
            seance_length: 3600,
          },
        ],
      ],
    },
    {
      id: 6671852,
      salon_service_id: 7392548,
      title: 'Аренда класса 2 часа',
      category_id: 6671677,
      price_min: 900,
      price_max: 900,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 7200,
          },
          {
            id: 1273231,
            seance_length: 7200,
          },
        ],
      ],
    },
    {
      id: 6671855,
      salon_service_id: 7392551,
      title: 'Аренда класса 3 часа',
      category_id: 6671677,
      price_min: 1350,
      price_max: 1350,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 10800,
          },
          {
            id: 1273231,
            seance_length: 10800,
          },
        ],
      ],
    },
    {
      id: 6671859,
      salon_service_id: 7392555,
      title: 'Аренда класса 4 часа',
      category_id: 6671677,
      price_min: 1800,
      price_max: 1800,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 14400,
          },
          {
            id: 1273231,
            seance_length: 14400,
          },
        ],
      ],
    },
    {
      id: 6671868,
      salon_service_id: 7392564,
      title: 'Репетиция 1 час',
      category_id: 6519336,
      price_min: 500,
      price_max: 500,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 3600,
          },
        ],
      ],
    },
    {
      id: 6671895,
      salon_service_id: 7392591,
      title: 'Репетиция 2 часа',
      category_id: 6519336,
      price_min: 1000,
      price_max: 1000,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 7200,
          },
        ],
      ],
    },
    {
      id: 6671921,
      salon_service_id: 7392617,
      title: 'Репетиция 3 часа',
      category_id: 6519336,
      price_min: 1500,
      price_max: 1500,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 10800,
          },
        ],
      ],
    },
    {
      id: 6671953,
      salon_service_id: 7392649,
      title: 'Репетиция 4 часа',
      category_id: 6519336,
      price_min: 2000,
      price_max: 2000,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 14400,
          },
        ],
      ],
    },
    {
      id: 6755943,
      salon_service_id: 7482735,
      title: 'Аренда класса 1 час',
      category_id: 6750842,
      price_min: 500,
      price_max: 500,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 3600,
          },
        ],
      ],
    },
    {
      id: 6755952,
      salon_service_id: 7482744,
      title: 'Аренда класса 2 часа',
      category_id: 6750842,
      price_min: 1000,
      price_max: 1000,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 7200,
          },
        ],
      ],
    },
    {
      id: 6755955,
      salon_service_id: 7482747,
      title: 'Аренда класса 3 часа',
      category_id: 6750842,
      price_min: 1500,
      price_max: 1500,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 10800,
          },
        ],
      ],
    },
    {
      id: 6755961,
      salon_service_id: 7482753,
      title: 'Аренда класса 4 часа',
      category_id: 6750842,
      price_min: 2000,
      price_max: 2000,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 14400,
          },
        ],
      ],
    },
    {
      id: 6755967,
      salon_service_id: 7482759,
      title: 'Аренда класса 5 часов',
      category_id: 6750842,
      price_min: 2500,
      price_max: 2500,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 18000,
          },
        ],
      ],
    },
    {
      id: 6756134,
      salon_service_id: 7482926,
      title: 'Аренда класса 6 часов',
      category_id: 6750842,
      price_min: 3000,
      price_max: 3000,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 21600,
          },
        ],
      ],
    },
    {
      id: 6756148,
      salon_service_id: 7482940,
      title: 'Аренда класса 7 часов',
      category_id: 6750842,
      price_min: 3000,
      price_max: 3000,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 25200,
          },
        ],
      ],
    },
    {
      id: 6756150,
      salon_service_id: 7482942,
      title: 'Репетиция 5 часов',
      category_id: 6519336,
      price_min: 2500,
      price_max: 2500,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 18000,
          },
        ],
      ],
    },
    {
      id: 6756157,
      salon_service_id: 7482949,
      title: 'Репетиция 6 часов',
      category_id: 6519336,
      price_min: 3000,
      price_max: 3000,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 21600,
          },
        ],
      ],
    },
    {
      id: 6756163,
      salon_service_id: 7482955,
      title: 'Репетиция 7 часов',
      category_id: 6519336,
      price_min: 3000,
      price_max: 3000,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1273259,
            seance_length: 25200,
          },
        ],
      ],
    },
    {
      id: 6756171,
      salon_service_id: 7482963,
      title: 'Аренда класса 5 часов',
      category_id: 6671677,
      price_min: 2250,
      price_max: 2250,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 18000,
          },
          {
            id: 1273231,
            seance_length: 18000,
          },
        ],
      ],
    },
    {
      id: 6756175,
      salon_service_id: 7482967,
      title: 'Аренда класса 6 часов',
      category_id: 6671677,
      price_min: 2700,
      price_max: 2700,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 21600,
          },
          {
            id: 1273231,
            seance_length: 21600,
          },
        ],
      ],
    },
    {
      id: 6756180,
      salon_service_id: 7482972,
      title: 'Аренда класса 7 часов',
      category_id: 6671677,
      price_min: 2700,
      price_max: 2700,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 25200,
          },
          {
            id: 1273231,
            seance_length: 25200,
          },
        ],
      ],
    },
    {
      id: 6756199,
      salon_service_id: 7482991,
      title: 'Аренда класса 5 часов',
      category_id: 6671669,
      price_min: 2250,
      price_max: 2250,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 18000,
          },
          {
            id: 1273231,
            seance_length: 18000,
          },
          {
            id: 1273259,
            seance_length: 18000,
          },
        ],
      ],
    },
    {
      id: 6756207,
      salon_service_id: 7482999,
      title: 'Аренда класса 6 часов',
      category_id: 6671669,
      price_min: 2700,
      price_max: 2700,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 21600,
          },
          {
            id: 1273231,
            seance_length: 21600,
          },
          {
            id: 1273259,
            seance_length: 21600,
          },
        ],
      ],
    },
    {
      id: 6756209,
      salon_service_id: 7483001,
      title: 'Аренда класса 7 часов',
      category_id: 6671669,
      price_min: 2700,
      price_max: 2700,
      discount: 0,
      comment: '',
      weight: 0,
      active: 1,
      api_id: '0',
      prepaid: 'forbidden',
      is_multi: false,
      capacity: 0,
      image_group: [],
      staff: [
        [
          {
            id: 1233780,
            seance_length: 25200,
          },
          {
            id: 1273231,
            seance_length: 25200,
          },
          {
            id: 1273259,
            seance_length: 25200,
          },
        ],
      ],
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
  date: item.datetime,
  hours: item.seance_length / 3600,
});

export const musbookingOrderToYclientsService = (
  sum: number,
  roomId: YClientsId,
  seanceLength: number
) => {
  const found = config.services
    .filter((item) =>
      item.staff.some((i) =>
        i.some((j) => j.id === roomId && j.seance_length === seanceLength)
      )
    )
    .find((item) => item.price_min === sum || item.price_min === sum * 2);

  if (!found) {
    return null;
  }

  return {
    id: found.id,
    amount: 1,
    discount: 0,
    cost: sum,
    first_cost: sum,
  };
};

export const musbookingOrderDurationToYclientsSeanceLength = (
  item: Order
): number =>
  dateRangeToHours(new Date(item.dateFrom), new Date(item.dateTo)) * 3600;

export const musbookingOrderToYclientsRecord = (
  item: Order
): YClientsRecord => {
  const seanceLength = musbookingOrderDurationToYclientsSeanceLength(item);
  const staffId = musbookingRoomIdToYclientsRoomId(item.roomId);
  const service = musbookingOrderToYclientsService(
    item.totalOrder,
    staffId,
    seanceLength
  ) || {
    id: 6671791,
    discount: 0,
    cost: item.totalOrder,
    first_cost: item.totalOrder,
    amount: 1,
  };

  return {
    staff_id: staffId,
    services: [service],
    client: {
      phone: `+7${item.phone || '0000000000'}`,
      name: item.client || 'Клиент MUSBooking',
      email: item.email || 'unknown@email.com',
    },
    datetime: formatISO(new Date(item.dateFrom)),
    seance_length: seanceLength,
    save_if_busy: false,
    send_sms: false,
    custom_color: '6c6c6c',
    comment: `${item.comment || 'Перенесено из MUSBooking'}`,
  };
};
