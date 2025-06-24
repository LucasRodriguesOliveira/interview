import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ILoggerService } from '../../../domain/service/logger.interface';
import { ExceptionMessage } from '../../../domain/exception/exception-message';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: ILoggerService) {}

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let result: ExceptionMessage;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      result = exception.getResponse() as ExceptionMessage;
    } else {
      result = {
        message: exception.message,
      };
    }

    const responseData = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...result,
    };

    console.log(request.body);
    this.logMessage(request.path, request.method, result, status, exception);

    response.status(status).json(responseData);
  }

  private logMessage(
    path: string,
    method: string,
    message: ExceptionMessage,
    status: number,
    exception: HttpException | Error,
  ) {
    if (HttpStatus.INTERNAL_SERVER_ERROR === status) {
      this.logger.error(
        `End Request for ${path}`,
        `method=${method} status=${status} errCode=${message.errCode ?? null} message=${message.message ?? null}`,
        exception.stack,
      );
      return;
    }

    this.logger.warn(
      `End Request for ${path}`,
      `method=${method} status=${status} errCode=${message.errCode ?? null} message=${message.message ?? null}`,
    );
  }
}
