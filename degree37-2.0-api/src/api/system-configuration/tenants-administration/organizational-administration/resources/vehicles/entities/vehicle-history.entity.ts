import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VehicleHistory {
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

  @Column({ type: 'bigint', nullable: false })
  vehicle_type_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  replace_vehicle_id: bigint;

  @Column({ nullable: true })
  retire_on: Date;

  @Column({ type: 'bigint', nullable: false })
  collection_operation_id: bigint;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
