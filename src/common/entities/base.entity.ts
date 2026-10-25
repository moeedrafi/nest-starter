import { Audit } from './audit.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class CustomBaseEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}

export abstract class CustomBaseEntityWithoutAudit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
