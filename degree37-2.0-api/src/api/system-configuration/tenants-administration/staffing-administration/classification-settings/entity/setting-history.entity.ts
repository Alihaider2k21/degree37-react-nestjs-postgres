import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from '../../../../../common/entities/generic-history.entity';
@Entity()
export class StaffingClassificationSettingHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', name: 'classification_id', nullable: true })
  classification_id: bigint;

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
  min_hours_per_week: number;

  @Column({ type: 'int', nullable: false })
  target_hours_per_week: number;

  @Column({ type: 'int', nullable: false })
  max_weekends_per_months: number;

  @Column({ type: 'int', nullable: false })
  overtime_threshold: number;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
