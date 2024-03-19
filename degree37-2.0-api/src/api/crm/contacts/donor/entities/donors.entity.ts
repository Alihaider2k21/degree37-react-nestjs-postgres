import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Prefixes } from '../../common/prefixes/entities/prefixes.entity';
import { Suffixes } from '../../common/suffixes/entities/suffixes.entity';

@Entity()
export class Donors extends GenericEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  external_id: string;

  @ManyToOne(() => Prefixes, (prefixes) => prefixes.id, { nullable: true })
  @JoinColumn({ name: 'prefix_id' })
  @Column({ type: 'bigint', nullable: true })
  prefix_id: bigint;

  @ManyToOne(() => Suffixes, (suffixes) => suffixes.id, { nullable: true })
  @JoinColumn({ name: 'suffix_id' })
  @Column({ type: 'bigint', nullable: true })
  suffix_id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  last_name: string;

  @Column({ type: 'timestamp', precision: 6, nullable: false })
  birth_date: Date;

  @Column({ type: 'varchar', length: 60, nullable: true })
  nick_name: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  blood_type: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @Column({ type: 'varchar', nullable: true })
  middle_name: string;

  @Column({ type: 'date', nullable: true })
  record_create_date: Date;

  @Column({ type: 'date', nullable: true })
  last_update_date: Date;

  @Column({ type: 'date', nullable: true })
  next_recruit_date: Date;

  @Column({ type: 'date', nullable: true })
  greatest_deferral_date: Date;

  @Column({ type: 'date', nullable: true })
  last_donation_date: Date;

  @Column({ type: 'date', nullable: true })
  appointment_date: Date;

  @Column({ type: 'varchar', length: 1, nullable: true })
  gender: string;

  @Column({ type: 'varchar', nullable: true })
  geo_code: string;

  @Column({ type: 'varchar', nullable: true })
  group_category: string;

  @Column({ type: 'varchar', nullable: true })
  race: string;

  @Column({ type: 'varchar', nullable: true })
  misc_code: string;

  @Column({ type: 'varchar', nullable: true })
  rec_result: string;

  @Column({ type: 'int', nullable: false })
  gallon_award1: number;

  @Column({ type: 'int', nullable: false })
  gallon_award2: number;

  @Column({ type: 'int', nullable: false })
  donor_number: number;
}
