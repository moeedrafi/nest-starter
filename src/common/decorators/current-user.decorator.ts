import type { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    return request.user;
  },
);
