import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { StaffingClassification } from '../../classifications/entity/classification.entity';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
@Entity()
export class StaffingClassificationSetting extends GenericEntity {
  @ManyToOne(
    () => StaffingClassification,
    (classification) => classification.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'classification_id' })
  classification_id: bigint;

  @Column({ type: 'int', nullable: true })
  target_hours_per_week: number;

  @Column({ type: 'int', nullable: true })
  minimum_hours_per_week: number;

  @Column({ type: 'int', nullable: false })
  max_consec_days_per_week: number;

  @Column({ type: 'int', nullable: false })
  min_days_per_week: number;

  @Column({ type: 'int', nullable: false })
  max_days_per_week: number;

  @Column({ type: 'int', nullable: false })
  max_hours_per_week: number;

  @Column({ type: 'int', nullable: false })
  max_weekend_hours: number;

  @Column({ type: 'int', nullable: false })
  min_recovery_time: number;

  @Column({ type: 'int', nullable: false })
  max_consec_weekends: number;

  @Column({ type: 'int', nullable: false })
  max_ot_per_week: number;

  @Column({ type: 'int', nullable: false })
  max_weekends_per_months: number;

  @Column({ type: 'int', nullable: false })
  overtime_threshold: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
