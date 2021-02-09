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
}

export type WebHookStatus = 'create' | 'update' | 'delete';

export interface WebHookAction extends Record<string, unknown> {
  status: WebHookStatus;
  data: YClientsRecord;
}

export const YClientsServiceId = 'yclients';
