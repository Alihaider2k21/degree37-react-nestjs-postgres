import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class DailyGoalsAllocationHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  procedure_type_id: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  effective_date: Date;

  @Column({ type: 'float' })
  sunday: number;

  @Column({ type: 'float' })
  monday: number;

  @Column({ type: 'float' })
  tuesday: number;

  @Column({ type: 'float' })
  wednesday: number;

  @Column({ type: 'float' })
  thursday: number;

  @Column({ type: 'float' })
  friday: number;

  @Column({ type: 'float' })
  saturday: number;

  @Column({ name: 'tenant_id', type: 'bigint', nullable: false })
  tenant_id: bigint;
}
