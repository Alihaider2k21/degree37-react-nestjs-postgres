import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { GenericHistoryEntity } from '../../../common/entities/generic-history.entity';

@Entity()
export class CrmNonCollectionProfilesHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 60, nullable: true })
  profile_name: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  alternate_name: string;

  @Column({ type: 'bigint' })
  event_category_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  event_subcategory_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  collection_operation_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'bigint' })
  owner_id: bigint;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;
}
