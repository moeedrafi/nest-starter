import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { RequestWithUser } from '@/common/interfaces/user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();
    const accessToken = request.cookies?.access_token as string | undefined;

    if (!accessToken) {
      throw new UnauthorizedException('User not authenticated');
    }

    try {
      const payload: RequestWithUser =
        await this.jwtService.verifyAsync(accessToken);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }
}
