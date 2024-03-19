import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  short_name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'bigint', nullable: true })
  device_type: bigint;

  @Column({ type: 'bigint', nullable: true })
  replace_device: bigint;

  @Column({ nullable: true })
  retire_on: Date;

  @Column({ type: 'bigint', nullable: true })
  collection_operation: bigint;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'bigint', nullable: true })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
