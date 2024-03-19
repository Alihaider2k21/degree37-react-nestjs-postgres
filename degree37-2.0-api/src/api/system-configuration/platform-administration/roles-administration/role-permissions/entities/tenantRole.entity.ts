import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Roles } from './role.entity';
import { Tenant } from '../../../tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class TenantRole {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => Roles, (role) => role.tenantRoles)
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @ManyToOne(() => Tenant, (tenant) => tenant.tenantRoles, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
