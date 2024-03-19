import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { appliesToEnum } from '../enums/operation-status.enum';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class OperationsStatus {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  chip_color: string;

  @Column({
    type: 'enum',
    enum: appliesToEnum,
    nullable: false,
    array: true,
    default: [appliesToEnum.drives],
  })
  applies_to: Array<appliesToEnum>;

  @Column({ nullable: false, default: true })
  schedulable: boolean;

  @Column({ nullable: false, default: true })
  hold_resources: boolean;

  @Column({ nullable: false, default: true })
  contribute_to_scheduled: boolean;

  @Column({ nullable: false, default: true })
  requires_approval: boolean;

  @Column({ nullable: false, default: false })
  is_archived: boolean;

  @Column({ nullable: false, default: true })
  is_active: boolean;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
