import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResourceSharingsFulfillmentHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'int', nullable: false })
  resource_share_id: bigint;

  @Column({ type: 'int', nullable: false })
  share_type_id: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;
}
