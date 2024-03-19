import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';

@Entity()
export class DailyGoalsCalendersHistory extends GenericHistoryEntity {
  @Column({
    type: 'date',
    nullable: true,
  })
  date: Date;

  @Column({ type: 'bigint', nullable: false })
  procedure_type: bigint;

  @Column({ type: 'float' })
  goal_amount: number;

  @Column({ type: 'bigint', nullable: false })
  collection_operation: bigint;

  @Column({ name: 'tenant_id', type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ default: false })
  is_locked: boolean;
}
