import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../../../../user-administration/user/entity/user.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
@Entity()
export class Approval {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: true })
  promotional_items: boolean;

  @Column({ nullable: true })
  marketing_materials: boolean;

  @Column({ nullable: true })
  tele_recruitment: boolean;

  @Column({ nullable: true })
  email: boolean;

  @Column({ nullable: false })
  sms_texting: boolean;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ type: 'bigint' })
  created_by_id: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
