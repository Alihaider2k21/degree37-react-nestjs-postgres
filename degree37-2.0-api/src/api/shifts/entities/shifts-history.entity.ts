import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
@Entity()
export class ShiftsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: true })
  shiftable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shiftable_type: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  start_time: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  end_time: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  break_start_time: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  break_end_time: Date;

  @Column({ type: 'double precision', nullable: true })
  reduction_percentage: number;

  @Column({ nullable: true })
  reduce_slots: boolean;

  @Column({ type: 'double precision', nullable: true })
  oef_procedures: number;

  @Column({ type: 'double precision', nullable: true })
  oef_products: number;

  @Column({ type: 'int', nullable: false })
  tenant_id: bigint;
}
