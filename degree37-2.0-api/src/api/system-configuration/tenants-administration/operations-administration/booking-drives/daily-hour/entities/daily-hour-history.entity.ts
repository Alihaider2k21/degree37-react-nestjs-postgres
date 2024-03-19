import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';
@Entity()
export class DailyHourHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', nullable: false })
  mon_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  mon_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  tue_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  tue_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  wed_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  wed_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  thu_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  thu_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  fri_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  fri_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  @Column({ type: 'varchar', nullable: false })
  sat_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  sat_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  sun_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  sun_latest_return_time: string;
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
