import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // @Roles() will add metadata of route

    const request: Request = context.switchToHttp().getRequest();
    const user = request['user']; // attached by AuthGuard

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // grab the id and gets its role
    const foundUser = true;
    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }

    // check if @Roles() matched with the role
    const notFound = true;
    if (notFound) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
