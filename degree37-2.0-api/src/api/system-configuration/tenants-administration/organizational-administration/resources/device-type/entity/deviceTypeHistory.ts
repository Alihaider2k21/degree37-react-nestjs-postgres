import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('device_type_history')
export class DeviceTypeHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ nullable: false })
  history_reason: string;

  @Column({ nullable: false })
  id: number;

  @Column()
  procedure_type_id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: false })
  is_archive: boolean;

  @Column()
  created_by: number;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
