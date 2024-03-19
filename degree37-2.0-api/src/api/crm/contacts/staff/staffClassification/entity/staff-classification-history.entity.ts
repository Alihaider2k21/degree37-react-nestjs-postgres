import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from '../../../../../common/entities/generic-history.entity';

@Entity('staff_classification_history')
export class StaffClassificationHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  staff_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  staffing_classification_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

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
}
