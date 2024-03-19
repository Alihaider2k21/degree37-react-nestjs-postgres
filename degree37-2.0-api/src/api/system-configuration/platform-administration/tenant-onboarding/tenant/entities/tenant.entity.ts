import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Address } from './address.entity';
import { TenantConfigurationDetail } from './tenantConfigurationDetail';
import { User } from '../../../../tenants-administration/user-administration/user/entity/user.entity';
import { TenantRole } from '../../../roles-administration/role-permissions/entities/tenantRole.entity';
import { Applications } from '../../../roles-administration/application/entities/application.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  tenant_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  tenant_domain: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  admin_domain: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  tenant_code: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone_number: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'varchar', length: 60, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  tenant_timezone: string;

  @Column({ default: false })
  allow_email: boolean;

  @Column({ type: 'boolean', default: false })
  has_superadmin: boolean;

  @OneToMany(() => Address, (address) => address.addressable_id, {
    nullable: false,
  })
  addresses: Address;

  @OneToMany(
    () => TenantConfigurationDetail,
    (configurationDetail) => configurationDetail.tenant_id,
    { nullable: false }
  )
  configuration_detail: TenantConfigurationDetail[];

  @OneToMany(() => TenantRole, (tenantRole) => tenantRole.role)
  tenantRoles: TenantRole[];

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  // @ManyToOne(() => User, (user) => user.id, { nullable: true })
  // @JoinColumn({name:'updated_by'})
  // updated_by?: bigint;

  @ManyToMany(() => Applications)
  @JoinTable({
    name: 'tenant_applications',
    joinColumn: {
      name: 'tenant_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'application_id',
      referencedColumnName: 'id',
    },
  })
  applications: Applications[];

  // @UpdateDateColumn({ nullable: false, type: 'timestamp' })
  // updated_at: Date;

  @Column({ type: 'int', nullable: true })
  allow_donor_minimum_age: number;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  dailystory_tenant_uid: string;

  @Column({ type: 'text', nullable: true })
  dailystory_token: string;

  @Column({ type: 'text', nullable: true })
  dailystory_tenant_id: string;

  @Column({ type: 'text', nullable: true })
  dailystory_funnel_uuid: string;

  @Column({ type: 'text', nullable: true })
  dailystory_mobile_key: string;

  @Column({ type: 'text', nullable: true })
  tenant_secret_key: string;

  @Column({ type: 'text', nullable: true })
  dailystory_campaign_id: string;
}
