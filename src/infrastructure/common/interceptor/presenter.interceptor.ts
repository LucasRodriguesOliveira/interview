import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { Result } from '../../../domain/types/application/result';
import { ErrorResponse } from '../../../domain/types/application/error/error.response';

interface IPresenterResultKey {
  entity: string;
  array?: string;
}

interface IPresenterOptions {
  paginated: boolean;
}

@Injectable()
export class PresenterInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly presenterCls: ClassConstructor<T>,
    private readonly presenterKey: IPresenterResultKey,
    private readonly presenterOptions: IPresenterOptions = {
      paginated: false,
    },
  ) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<T | T[]>,
  ): Observable<Record<string, T> | Record<string, T[]>> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          const key =
            this.presenterKey?.array ?? `${this.presenterKey.entity}s`;

          return {
            [key]: plainToInstance(this.presenterCls, data),
          };
        }

        if (this.presenterOptions.paginated) {
          return {
            [this.presenterKey.array!]: plainToInstance(
              this.presenterCls,
              data[`${this.presenterKey.entity}s`],
            ),
            total: data['total'],
            page: data['page'],
            pageSize: data['pageSize'],
          };
        }

        return {
          [this.presenterKey.entity]: plainToInstance(this.presenterCls, data),
        };
      }),
    );
  }
}
