import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Facility } from '../../entity/facility.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';

@Entity({ name: 'donor_center_blueprints' })
export class DonorCenterBluePrints extends GenericEntity {
  @Column({ nullable: false })
  name: string;

  @Column('double precision', { nullable: false })
  oef_products: number;

  @Column('double precision', { nullable: false })
  oef_procedures: number;

  @Column({ nullable: false, default: false })
  is_default: boolean;

  @Column({ default: false })
  is_active: boolean;

  @Column({ nullable: false, default: false })
  monday: boolean;

  @Column({ nullable: false, default: false })
  tuesday: boolean;

  @Column({ nullable: false, default: false })
  wednesday: boolean;

  @Column({ default: false })
  thursday: boolean;

  @Column({ nullable: false, default: false })
  friday: boolean;

  @Column({ nullable: false, default: false })
  saturday: boolean;

  @Column({ default: false })
  sunday: boolean;

  @ManyToOne(() => Facility, (facility) => facility.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'donorcenter_id' })
  donorcenter: Facility;

  @Column({ type: 'bigint', nullable: true })
  donorcenter_id: bigint;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;
}
