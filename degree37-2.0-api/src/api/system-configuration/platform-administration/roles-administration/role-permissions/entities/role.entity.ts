import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { RolePermission } from './rolePermission.entity';
import { User } from '../../../../tenants-administration/user-administration/user/entity/user.entity';
import { TenantRole } from './tenantRole.entity';
import { Tenant } from '../../../tenant-onboarding/tenant/entities/tenant.entity';
@Entity()
export class Roles {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ type: 'boolean', default: false })
  is_recruiter: boolean;

  @Column({ type: 'boolean', default: false })
  is_impersonateable_role: boolean;

  @Column({ default: false })
  is_auto_created: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @OneToMany(() => TenantRole, (tenantRole) => tenantRole.role)
  tenantRoles: TenantRole[];

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: bigint;
}
