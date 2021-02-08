import axios from 'axios';
import * as qs from 'querystring';
import { getResponseData } from '@triton/common';
import {
  Order,
  OrderCreateOptions,
  OrderUpdateOptions,
} from '@triton/musbooking-common';

const ax = axios.create({
  baseURL: process.env.MUSBOOKING_API_URL,
  headers: {
    'User-Agent': process.env.USER_AGENT,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

type LoginResponse = { token: string };
export const login = (
  login: string,
  password: string
): Promise<LoginResponse> =>
  ax({
    url: '/auth/login',
    method: 'POST',
    data: qs.stringify({
      login,
      password,
    }),
  }).then(getResponseData);

type SyncListResponse = Array<Order>;
export const syncList = (
  token: string,
  lastCheck = new Date()
): Promise<SyncListResponse> =>
  ax({
    url: '/orders/sync-list',
    method: 'GET',
    params: {
      date: lastCheck.toISOString(),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(getResponseData);

type SyncAddResponse = { id: string };
export const syncAdd = (
  token: string,
  { date, room, hours }: OrderCreateOptions
): Promise<SyncAddResponse> =>
  ax({
    url: '/orders/sync-add',
    method: 'POST',
    data: qs.stringify({
      date,
      room,
      hours,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(getResponseData);

export const syncUpdate = (
  token,
  { id, status }: OrderUpdateOptions
): Promise<void> =>
  ax({
    url: '/orders/sync-update',
    method: 'POST',
    data: qs.stringify({
      id,
      status,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(getResponseData);
