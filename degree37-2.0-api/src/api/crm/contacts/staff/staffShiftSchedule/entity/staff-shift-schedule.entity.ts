import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { Staff } from '../../entities/staff.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { StaffingClassificationSetting } from 'src/api/system-configuration/tenants-administration/staffing-administration/classification-settings/entity/setting.entity';

@Entity('staff_shift_schedule')
export class StaffShiftSchedule extends GenericEntity {
  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff_id: bigint;

  @Column({ type: 'time', nullable: false })
  monday_start_time: string;

  @Column({ type: 'time', nullable: false })
  monday_end_time: string;

  @Column({ type: 'time', nullable: false })
  tuesday_start_time: string;

  @Column({ type: 'time', nullable: false })
  tuesday_end_time: string;

  @Column({ type: 'time', nullable: false })
  wednesday_start_time: string;

  @Column({ type: 'time', nullable: false })
  wednesday_end_time: string;

  @Column({ type: 'time', nullable: false })
  thursday_start_time: string;

  @Column({ type: 'time', nullable: false })
  thursday_end_time: string;

  @Column({ type: 'time', nullable: false })
  friday_start_time: string;

  @Column({ type: 'time', nullable: false })
  friday_end_time: string;

  @Column({ type: 'time', nullable: false })
  saturday_start_time: string;

  @Column({ type: 'time', nullable: false })
  saturday_end_time: string;

  @Column({ type: 'time', nullable: false })
  sunday_start_time: string;

  @Column({ type: 'time', nullable: false })
  sunday_end_time: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: bigint;
}
