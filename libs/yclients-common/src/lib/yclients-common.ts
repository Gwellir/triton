export type YClientsId = number;

export interface YClientsRecord extends Record<string, unknown> {
  id?: YClientsId;
  staff_id: number;
  datetime: string;
  seance_length: number;
  services: Array<{
    id: number;
    first_cost: number;
    discount: number;
    cost: number;
    amount: number;
  }>;
  client: {
    phone: string | null;
    name: string | null;
    email: string | null;
  };
  save_if_busy: boolean;
  send_sms: boolean;
  comment: string | null;
  custom_color?: string;
  deleted?: boolean;
}

export interface YClientsService {
  id: number;
  salon_service_id: number;
  title: string;
  category_id: number;
  price_min: number;
  price_max: number;
  discount: number;
  comment: string;
  weight: number;
  active: number;
  api_id: string;
  prepaid: string;
  is_multi: boolean;
  capacity: number;
  image_group: Array<Record<string, unknown>>;
  staff: Array<{
    id: number;
    seance_length: number;
  }>[];
}

export type WebHookStatus = 'create' | 'update' | 'delete';

export interface WebHookAction extends Record<string, unknown> {
  status: WebHookStatus;
  data: YClientsRecord;
}

export const YClientsServiceId = 'yclients';
