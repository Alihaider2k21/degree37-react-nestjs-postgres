import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { ApprovalStatusEnum } from '../../drives/enums';

@Entity('oc_non_collection_events_history')
export class NonCollectionEventsHistory extends GenericHistoryEntity {
  @Column({ type: Date, nullable: false })
  date: Date;

  @Column({ type: 'varchar', nullable: false })
  event_name: string;

  @Column({ type: 'bigint', nullable: false })
  owner_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  non_collection_profile_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  location_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  collection_operation_id: bigint;

  @Column({
    type: 'enum',
    enum: ApprovalStatusEnum,
    default: ApprovalStatusEnum.APPROVED,
    nullable: false,
  })
  approval_status: ApprovalStatusEnum;

  @Column({ type: 'bigint', nullable: false })
  status_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  event_category_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  event_subcategory_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  changes_from: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  changes_to: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  changes_field: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  changed_when: string;
}
