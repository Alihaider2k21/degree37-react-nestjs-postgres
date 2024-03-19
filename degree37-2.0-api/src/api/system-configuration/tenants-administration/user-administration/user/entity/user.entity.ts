import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Roles } from '../../../../platform-administration/roles-administration/role-permissions/entities/role.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { OrganizationalLevels } from '../../../organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { UserBusinessUnits } from './user-business-units.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  last_permissions_updated: Date;

  @Column({ unique: true, nullable: true })
  keycloak_username: string;

  @Column({ unique: true, nullable: true })
  unique_identifier?: string;

  @Column({ nullable: true, default: false })
  is_impersonateable_user: boolean;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  date_of_birth?: Date;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  home_phone_number?: string;

  @Column({ nullable: true })
  work_phone_number?: string;

  @Column({ nullable: true })
  work_phone_extension?: string;

  @Column({ nullable: true })
  address_line_1?: string;

  @Column({ nullable: true })
  address_line_2?: string;

  @Column({ nullable: true })
  zip_code?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  all_hierarchy_access: boolean;

  @Column({ default: false })
  is_super_admin: boolean;

  @Column({ default: false })
  is_auto_created: boolean;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true, default: false })
  is_manager: boolean;

  @ManyToOne(
    () => OrganizationalLevels,
    (OrganizationalLevel) => OrganizationalLevel.id,
    { nullable: true }
  )
  @JoinColumn({ name: 'hierarchy_level' })
  hierarchy_level: bigint;

  @OneToMany(
    () => UserBusinessUnits,
    (userBusinessUnits) => userBusinessUnits.user_id
  )
  business_units: UserBusinessUnits[];

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'assigned_manager' })
  assigned_manager: bigint;

  @Column({ nullable: true, default: false })
  override: boolean;

  @Column({ nullable: true, default: false })
  adjust_appointment_slots: boolean;

  @Column({ nullable: true, default: false })
  resource_sharing: boolean;

  @Column({ nullable: true, default: false })
  edit_locked_fields: boolean;

  @Column({ nullable: true, default: true })
  account_state: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant' })
  tenant: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by?: bigint;

  @ManyToOne(() => Roles, (role) => role.id, { nullable: true })
  @JoinColumn({ name: 'role' })
  role?: Roles;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ type: 'text', nullable: true })
  dailystory_useruid: string;
}
