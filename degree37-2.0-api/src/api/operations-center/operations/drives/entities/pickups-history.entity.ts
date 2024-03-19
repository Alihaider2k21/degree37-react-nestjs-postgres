import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('pickups_history')
export class PickupsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', name: 'pickable_id', nullable: false })
  pickable_id: bigint;

  @Column({ type: 'bigint', name: 'equipment_id', nullable: false })
  equipment_id: bigint;

  @Column({ type: 'int', nullable: true })
  pickable_type: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  start_time: Date;

  @Column({ type: 'text', nullable: true })
  description: string;
}
