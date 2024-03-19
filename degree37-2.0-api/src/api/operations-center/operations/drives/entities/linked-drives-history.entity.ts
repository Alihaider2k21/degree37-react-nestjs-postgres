import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('linked_drives_history')
export class LinkedDrivesHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'bigint', nullable: false })
  current_drive_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  prospective_drive_id: bigint;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;
}
