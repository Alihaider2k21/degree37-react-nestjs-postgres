import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'stages_history' })
export class StagesHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
