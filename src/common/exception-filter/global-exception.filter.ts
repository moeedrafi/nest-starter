import { Request, Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { errorMessage, errorStack } from './error';
import { mapDatabaseError } from './database-error';

interface ErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  path: string;
  timestamp: string;
}

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  code?: string;
  details?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const result = this.normalizeException(exception);
    this.logException(exception, request, result.statusCode);

    const errorResponse: ErrorResponse = {
      statusCode: result.statusCode,
      code: result.code,
      message: result.message,
      ...(result.details !== undefined && {
        details: result.details,
      }),
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };

    response.status(result.statusCode).json(errorResponse);
  }

  private normalizeException(exception: unknown): {
    statusCode: number;
    code: string;
    message: string;
    details?: unknown;
  } {
    /**
     * 1. Nesjs builtin exceptions
     */
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    /**
     * 2. Database exceptions
     */
    const databaseError = mapDatabaseError(exception);
    if (databaseError) {
      return databaseError;
    }

    /**
     * 3. Unknown/unhandled exception
     */
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    };
  }

  private handleHttpException(exception: HttpException): {
    statusCode: number;
    code: string;
    message: string;
    details?: unknown;
  } {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const body = exceptionResponse as HttpExceptionResponse;

      let message = body.message;

      /**
       * Nest ValidationPipe can produce:
       * message: [
       *   "email must be an email",
       *   "password must be..."
       * ]
       */
      if (Array.isArray(message)) {
        message = message.join(', ');
      }

      return {
        statusCode,
        code: this.getDefaultCode(statusCode),
        message: message ?? 'Request failed',
      };
    }

    /**
     * Built-in Nest exceptions can return
     * a simple string.
     */
    if (typeof exceptionResponse === 'string') {
      return {
        statusCode,
        code: this.getDefaultCode(statusCode),
        message: exceptionResponse,
      };
    }

    return {
      statusCode,
      code: this.getDefaultCode(statusCode),
      message: 'Request failed',
    };
  }

  private getDefaultCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';

      case 401:
        return 'UNAUTHORIZED';

      case 403:
        return 'FORBIDDEN';

      case 404:
        return 'NOT_FOUND';

      case 409:
        return 'CONFLICT';

      case 422:
        return 'UNPROCESSABLE_ENTITY';

      case 429:
        return 'TOO_MANY_REQUESTS';

      default:
        return status >= 500 ? 'INTERNAL_ERROR' : 'HTTP_ERROR';
    }
  }

  private logException(
    exception: unknown,
    request: Request,
    statusCode: number,
  ): void {
    const message = errorMessage(exception);
    const stack = errorStack(exception);

    /**
     * 5xx = server-side problem
     */
    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.originalUrl} - ${message}`,
        stack,
      );

      return;
    }

    /**
     * 4xx are normally expected client errors.
     *
     * You usually don't need to log every 400/401/404
     * as an ERROR.
     */
    this.logger.warn(`${request.method} ${request.originalUrl} - ${message}`);
  }
}
