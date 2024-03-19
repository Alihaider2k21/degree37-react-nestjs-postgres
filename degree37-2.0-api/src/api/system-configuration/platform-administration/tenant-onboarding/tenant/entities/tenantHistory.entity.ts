import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { enumStatus } from '../interface/tenant.interface';

@Entity()
export class TenantHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 255 })
  tenant_name: string;

  @Column({ type: 'varchar', length: 1 })
  history_reason: string;

  @Column({ default: false })
  allow_email: boolean;

  @Column({ type: 'varchar', length: 255 })
  tenant_domain: string;

  @Column({ type: 'varchar', length: 255 })
  admin_domain: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 60 })
  tenant_code: string;

  @Column({ type: 'varchar', length: 20 })
  phone_number: string;

  @Column({
    type: 'enum',
    enum: enumStatus,
  })
  status: enumStatus;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ type: 'varchar', length: 5 })
  tenant_timezone: string;

  @Column({ type: 'int', nullable: true })
  allow_donor_minimum_age: number;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;
}
