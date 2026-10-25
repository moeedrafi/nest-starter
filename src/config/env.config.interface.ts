import type { StringValue } from 'ms';

export interface IServer {
  env: string;
  port: number;
  corsOrigin: string[];
}

export interface IAuthentication {
  frontendUrl: string;
  jwtSecret: string;
  expiry: StringValue;
  refreshJWTSecret: string;
  refreshExpiry: StringValue;
  resetPasswordSecret: string;
  resetPasswordExpiry: StringValue;
}

export interface IDatabase {
  url: string;
  sync: boolean;
  ssl: boolean;
}

export interface IEmail {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromName: string;
  fromAddress: string;
}
