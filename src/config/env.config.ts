import { StringValue } from 'ms';
import { registerAs } from '@nestjs/config';
import {
  IAuthentication,
  IDatabase,
  IServer,
  IEmail,
} from './env.config.interface';

export const server = registerAs('server', (): IServer => ({
  port: parseInt(process.env.PORT!),
  env: process.env.NODE_ENV!,
  corsOrigin: process.env
    .CORS_ORIGIN!.split(',')
    .map((val: string) => val.trim()),
}));

export const authentication = registerAs(
  'authentication',
  (): IAuthentication => ({
    frontendUrl: process.env.FRONTEND_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    expiry: process.env.JWT_EXPIRES_IN as StringValue,
    refreshJWTSecret: process.env.REFRESH_TOKEN_SECRET!,
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
    resetPasswordSecret: process.env.RESET_PASSWORD_TOKEN_SECRET!,
    resetPasswordExpiry: process.env
      .RESET_PASSWORD_TOKEN_EXPIRES_IN as StringValue,
  }),
);

export const database = registerAs('database', (): IDatabase => ({
  url: process.env.DATABASE_URL!,
  sync: process.env.DATABASE_SYNC === 'true',
  ssl: process.env.DATABASE_SSL === 'true',
}));

export const email = registerAs('email', (): IEmail => ({
  host: process.env.MAIL_HOST!,
  port: parseInt(process.env.MAIL_PORT!),
  secure: process.env.MAIL_SECURE === 'true',
  user: process.env.MAIL_USER!,
  password: process.env.MAIL_PASSWORD!,
  fromName: process.env.MAIL_FROM_NAME!,
  fromAddress: process.env.MAIL_FROM_ADDRESS!,
}));
