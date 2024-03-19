import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class ResourceSharingsHistory extends GenericHistoryEntity {
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'int', nullable: false })
  share_type: number;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'bigint' })
  tenant_id: bigint;

  @Column({ type: 'bigint' })
  from_collection_operation_id: bigint;

  @Column({ type: 'bigint' })
  to_collection_operation_id: bigint;
}
