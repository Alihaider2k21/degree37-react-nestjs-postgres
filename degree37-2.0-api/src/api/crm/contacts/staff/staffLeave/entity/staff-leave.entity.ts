import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { StaffLeaveType } from '../enum/staff-leave-type.enum';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';

@Entity()
export class StaffLeave extends GenericEntity {
  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @Column({ type: 'bigint' })
  staff_id: bigint;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'enum', enum: StaffLeaveType })
  type: StaffLeaveType;

  @Column({ type: 'date' })
  begin_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'int' })
  hours: number;

  @Column({ type: 'text' })
  note: string;
}
