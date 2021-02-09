import axios from 'axios';
import { getResponseData } from '@triton/common';
import { YClientsRecord } from '@triton/yclients-common';

type ApiResponse<T extends Record<string, unknown>> = {
  success: boolean;
  data: T;
  meta?: {
    message: string;
  };
};

const ax = axios.create({
  baseURL: process.env.YCLIENTS_API_URL,
  headers: {
    Accept: 'application/vnd.yclients.v2+json',
    'User-Agent': process.env.USER_AGENT,
  },
});

export const create = (
  token: string,
  userToken: string,
  item: YClientsRecord
) =>
  ax({
    url: `/records/${process.env.YCLIENTS_COMPANY_ID}`,
    data: {
      ...item,
    },
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}, User ${userToken}`,
    },
  }).then(getResponseData);

export const update = (
  token: string,
  userToken: string,
  item: YClientsRecord
) =>
  ax({
    url: `/record/${process.env.YCLIENTS_COMPANY_ID}/${item.id}`,
    data: {
      ...item,
    },
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}, User ${userToken}`,
    },
  }).then(getResponseData);

export const remove = (token: string, userToken: string, id: number) =>
  ax({
    url: `/record/${process.env.YCLIENTS_COMPANY_ID}/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}, User ${userToken}`,
    },
  }).then(getResponseData);
