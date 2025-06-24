import { ExceptionMessage } from './exception-message';

export interface IHttpExceptionService {
  badRequest(message: ExceptionMessage): never;
  internalServerError(message?: ExceptionMessage): never;
  forbidden(message?: ExceptionMessage): never;
  unauthorized(message?: ExceptionMessage): never;
  notFound(message: ExceptionMessage): never;
}
