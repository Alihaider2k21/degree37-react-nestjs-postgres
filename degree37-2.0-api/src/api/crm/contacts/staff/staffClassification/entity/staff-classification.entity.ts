import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { Staff } from '../../entities/staff.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { StaffingClassification } from 'src/api/system-configuration/tenants-administration/staffing-administration/classifications/entity/classification.entity';

@Entity('staff_classification')
export class StaffClassification extends GenericEntity {
  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff_id: Staff;

  @ManyToOne(
    () => StaffingClassification,
    (staffingClassification) => staffingClassification.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'staffing_classification_id' })
  staffing_classification_id: StaffingClassification;

  @Column({ type: 'int', nullable: false })
  target_hours_per_week: number;

  @Column({ type: 'int', nullable: false })
  minimum_hours_per_week: number;

  @Column({ type: 'int', nullable: false })
  maximum_hours_per_week: number;

  @Column({ type: 'int', nullable: false })
  minimum_days_per_week: number;

  @Column({ type: 'int', nullable: false })
  maximum_days_per_week: number;

  @Column({ type: 'int', nullable: false })
  maximum_consecutive_days_per_week: number;

  @Column({ type: 'int', nullable: false })
  maximum_ot_per_week: number;

  @Column({ type: 'int', nullable: false })
  maximum_weekend_hours: number;

  @Column({ type: 'int', nullable: false })
  maximum_consecutive_weekends: number;

  @Column({ type: 'int', nullable: false })
  maximum_weekends_per_month: number;

  @Column({ type: 'int', nullable: false })
  overtime_threshold: number;

  @Column({ type: 'int', nullable: false })
  minimum_recovery_time: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: bigint;
}
