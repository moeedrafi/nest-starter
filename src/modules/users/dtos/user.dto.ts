import { Expose } from 'class-transformer';
import { UserRole } from '@/common/enums/enums';

export class UserDTO {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  username!: string;

  @Expose()
  role!: UserRole;
}
