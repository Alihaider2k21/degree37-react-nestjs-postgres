import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OwnerEnum, AppliesToEnum } from '../enums/enums';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('task')
export class TaskManagement {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: OwnerEnum,
  })
  owner: OwnerEnum;

  @Column({
    type: 'enum',
    enum: AppliesToEnum,
  })
  applies_to: AppliesToEnum;

  @Column({ type: 'int' })
  offset: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_archive: boolean;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
