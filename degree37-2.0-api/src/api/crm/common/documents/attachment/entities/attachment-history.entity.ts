import { GenericHistoryEntity } from '../../../../../common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class CrmAttachmentsHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 60, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'bigint', nullable: true })
  attachmentable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  attachmentable_type: string;

  @Column({ type: 'bigint', nullable: true })
  category_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  sub_category_id: bigint;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
