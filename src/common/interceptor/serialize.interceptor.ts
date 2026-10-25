import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';

interface ClassConstructor<T> {
  new (...args: any[]): T;
}

export function Serialize<T extends object>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T extends object> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Observable<unknown> {
    return handler.handle().pipe(
      map((response: unknown) => {
        if (
          typeof response === 'object' &&
          response !== null &&
          'data' in response
        ) {
          return {
            ...response,
            data: plainToInstance(this.dto, response.data, {
              excludeExtraneousValues: true,
            }),
          };
        }

        return plainToInstance(this.dto, response, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
