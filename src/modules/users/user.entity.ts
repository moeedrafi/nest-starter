import { UserRole } from '@/common/enums/enums';
import { CustomBaseEntityWithoutAudit } from '@/common/entities/base.entity';
import { Entity, Column, AfterInsert, AfterRemove, AfterUpdate } from 'typeorm';

@Entity()
export class User extends CustomBaseEntityWithoutAudit {
  @Column({ unique: true })
  email!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ nullable: true, select: true })
  refreshToken?: string;

  @Column({ nullable: true, select: true })
  resetToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry!: Date | null;

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id', this.id);
  }
}
