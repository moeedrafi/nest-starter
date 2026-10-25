import { UserRole } from '@/common/enums/enums';

export interface RequestWithUser {
  sub: string;
  role: UserRole;
}
