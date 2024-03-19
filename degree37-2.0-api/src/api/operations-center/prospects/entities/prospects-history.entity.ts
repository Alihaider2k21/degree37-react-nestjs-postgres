import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('prospects_history')
export class ProspectsHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'varchar', length: 500, nullable: false })
  description: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active: boolean;
}
