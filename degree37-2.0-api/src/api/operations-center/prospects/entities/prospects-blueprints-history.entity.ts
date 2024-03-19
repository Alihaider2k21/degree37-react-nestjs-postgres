import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('prospects_blueprints_history')
export class ProspectsBlueprintsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  prospect_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  blueprint_id: bigint;
}
