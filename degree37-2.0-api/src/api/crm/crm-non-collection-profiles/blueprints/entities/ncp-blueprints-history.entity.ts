import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('crm_ncp_blueprints_history')
export class CrmNcpBluePrintsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint' })
  crm_non_collection_profiles_id: bigint;

  @Column({ type: 'bigint' })
  tenant_id: bigint;

  @Column({ type: 'varchar', length: 100, nullable: true })
  blueprint_name: string;

  @Column({ type: 'bigint' })
  location_id: bigint;

  @Column({ type: 'text', nullable: true })
  additional_info: string;

  @Column({ type: 'boolean' })
  id_default: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
