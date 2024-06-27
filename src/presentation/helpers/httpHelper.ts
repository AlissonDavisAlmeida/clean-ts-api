import { ServerError, UnauthorizedError } from '../errors';
import { type HttpResponse } from '../protocols/http';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
});

export const accountAlreadyExists = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error instanceof ServerError ? error : new ServerError(error.stack, error.message)
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: {}
});
