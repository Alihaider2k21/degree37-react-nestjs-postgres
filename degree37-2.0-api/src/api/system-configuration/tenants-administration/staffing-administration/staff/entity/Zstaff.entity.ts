import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Roles } from '../../../../platform-administration/roles-administration/role-permissions/entities/role.entity';
import { TeamStaff } from '../../teams/entity/team-staff.entiity';
import { StaffCollectionOperation } from './staff-collection-operation.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: true })
  staff_prefix: string;

  @Column({ nullable: true })
  staff_suffix: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: true })
  nick_name: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  mailing_address: string;

  @Column({ nullable: true })
  zip_code: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  county: string;

  @Column({ nullable: true })
  classification: string;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (uuser) => uuser.id, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by?: bigint;

  @ManyToOne(() => Roles, (role) => role.id, { nullable: true })
  @JoinColumn({ name: 'role' })
  role?: bigint;

  @OneToMany(() => TeamStaff, (ts) => ts.staff_id)
  @JoinColumn({ name: 'team_staff' })
  teams?: TeamStaff[];

  @OneToMany(() => StaffCollectionOperation, (sco) => sco.staff_id)
  @JoinColumn({ name: 'staff_collection_operations' })
  collection_operations?: StaffCollectionOperation[];

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by?: bigint;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
