import { HttpStatus } from '@nestjs/common';

export interface Response {
  response: string;
  status: string;
  status_code: number;
  data: any[] | any;
  record_count: any;
}

export function resSuccess(
  message: string,
  status: string,
  statusCode: number,
  data?: any,
  count = 0
): Response {
  return {
    status,
    response: message,
    status_code: statusCode,
    record_count: count,
    data: data || null,
  };
}

export function resError(
  message: string,
  status: string,
  statusCode?: number,
  data?: any,
  count = 0
): Response {
  return {
    status,
    response: message,
    status_code: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    record_count: count,
    data: data || null,
  };
}
