import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { AuditFields } from '../../../audit-fields/entities/audit-fields.entity';
import { BookingRulesAddField } from './booking_rules_add_field.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class BookingRules {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: false, default: false })
  third_rail_fields_date: boolean;

  @Column({ nullable: false, default: false })
  third_rail_fields_hours: boolean;

  @Column({ nullable: false, default: false })
  third_rail_fields_staffing_setup: boolean;

  @Column({ nullable: false, default: false })
  third_rail_fields_projection: boolean;

  @Column({ nullable: false, default: false })
  third_rail_fields_location: boolean;

  @Column({ nullable: false, default: false })
  third_rail_fields_: boolean;

  @Column({ type: 'int', nullable: false })
  current_lock_lead_time: number;

  @Column({
    type: 'timestamp',
    precision: 6,
  })
  current_lock_lead_time_eff_date: Date;

  @Column({ type: 'int', nullable: true })
  schedule_lock_lead_time: number;

  @Column({
    type: 'timestamp',
    precision: 6,
  })
  schedule_lock_lead_time_eff_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  maximum_draw_hours: number;

  @Column({ nullable: false, default: false })
  maximum_draw_hours_allow_appt: boolean;

  @Column({ nullable: false, default: false })
  oef_block_on_product: boolean;

  @Column({ nullable: false, default: false })
  oef_block_on_procedures: boolean;

  @Column({ nullable: false, default: false })
  location_quali_drive_scheduling: boolean;

  @Column({ nullable: false, default: false })
  location_quali_expires: boolean;

  @Column({ type: 'int', nullable: false })
  location_quali_expiration_period: number;

  @Column({ type: 'int', nullable: false })
  sharing_max_miles: number;

  @Column()
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

  @JoinTable({
    name: 'booking_rules_add_field',
    joinColumn: {
      name: 'booking_rules_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'add_field_id',
      referencedColumnName: 'id',
    },
  })
  addFields?: AuditFields[];

  @OneToMany(
    () => BookingRulesAddField,
    (bookingRulesAddField) => bookingRulesAddField.bookingRules
  )
  booking_rules_add_field: BookingRulesAddField[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ nullable: true })
  tenant_id: number;
}
