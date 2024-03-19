import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class GenericHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ type: 'bigint', name: 'created_by' })
  created_by: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;
}
