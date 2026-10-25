import { map, Observable } from 'rxjs';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
  pagination?: Pagination;
}

type Pagination = {
  rpp: number;
  page: number;
  totalItems: number;
  totalPages: number;
};

export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    return handler.handle().pipe(
      map((data) => ({
        success: true,
        message: 'Request successful',
        data,
      })),
    );
  }
}
