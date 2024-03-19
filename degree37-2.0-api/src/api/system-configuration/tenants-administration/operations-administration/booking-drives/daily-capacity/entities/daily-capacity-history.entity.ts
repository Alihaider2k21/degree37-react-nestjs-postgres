import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';
@Entity()
export class DailyCapacityHistory extends GenericHistoryEntity {
  @Column({ type: 'int', nullable: false })
  mon_max_drives: number;

  @Column({ type: 'int', nullable: false })
  mon_max_staff: number;

  @Column({ type: 'int', nullable: false })
  tue_max_drives: number;

  @Column({ type: 'int', nullable: false })
  tue_max_staff: number;

  @Column({ type: 'int', nullable: false })
  wed_max_drives: number;

  @Column({ type: 'int', nullable: false })
  wed_max_staff: number;

  @Column({ type: 'int', nullable: false })
  thur_max_staff: number;

  @Column({ type: 'int', nullable: false })
  thur_max_drives: number;

  @Column({ type: 'int', nullable: false })
  fri_max_drives: number;

  @Column({ type: 'int', nullable: false })
  fri_max_staff: number;

  @Column({ type: 'int', nullable: false })
  sat_max_drives: number;

  @Column({ type: 'int', nullable: false })
  sat_max_staff: number;

  @Column({ type: 'int', nullable: false })
  sun_max_drives: number;

  @Column({ type: 'int', nullable: false })
  sun_max_staff: number;

  @Column('text', { array: true, default: {} })
  collection_operation: string[];

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  effective_start_date: Date;

  @Column({ type: 'date', nullable: true })
  effective_end_date: Date;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @Column({ default: false, nullable: false })
  is_archived: boolean;
}
