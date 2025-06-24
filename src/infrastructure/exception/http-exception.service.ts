import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IHttpExceptionService } from '../../domain/exception/http.interface';
import { ExceptionMessage } from '../../domain/exception/exception-message';

@Injectable()
export class HttpExceptionService implements IHttpExceptionService {
  public badRequest(message: ExceptionMessage): never {
    throw new BadRequestException(message);
  }

  public forbidden(message?: ExceptionMessage): never {
    throw new ForbiddenException(message);
  }

  public internalServerError(message?: ExceptionMessage): never {
    throw new InternalServerErrorException(message);
  }

  public unauthorized(message?: ExceptionMessage): never {
    throw new UnauthorizedException(message);
  }

  public notFound(message: ExceptionMessage): never {
    throw new NotFoundException(message);
  }
}
