import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { ShiftsSlots } from 'src/api/shifts/entities/shifts-slots.entity';

@Entity()
export class StaffAssignments extends GenericEntity {
  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff_id: Staff;

  @ManyToOne(() => ContactsRoles, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role_id: ContactsRoles;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => ShiftsSlots, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'shift_id' })
  shift_id: ShiftsSlots;

  @Column({ type: 'bigint', nullable: false })
  operation_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  operation_type: string;

  @Column({ type: 'boolean', nullable: false })
  is_additional: boolean;

  @Column({ type: 'int', nullable: false })
  home_base: number;

  @Column({ type: 'boolean', nullable: true })
  is_travel_time_included: boolean;

  @Column({ type: 'int', nullable: false })
  lead_time: number;

  @Column({ type: 'int', nullable: false })
  travel_to_time: number;

  @Column({ type: 'int', nullable: false })
  setup_time: number;

  @Column({ type: 'boolean', nullable: false })
  pending_assignment: boolean;

  @Column({ type: 'int', nullable: false })
  breakdown_time: number;

  @Column({ type: 'int', nullable: false })
  travel_from_time: number;

  @Column({ type: 'int', nullable: false })
  wrapup_time: number;

  @Column({ type: 'timestamp', precision: 6, nullable: false })
  clock_in_time: Date;

  @Column({ type: 'timestamp', precision: 6, nullable: false })
  clock_out_time: Date;

  @Column({ type: 'int', nullable: false })
  total_hours: number;

  @Column({ type: 'varchar', length: 60, nullable: false })
  status: string;
}
