import type { RequestWithUser } from './user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: RequestWithUser;
    }
  }
}

export {};
