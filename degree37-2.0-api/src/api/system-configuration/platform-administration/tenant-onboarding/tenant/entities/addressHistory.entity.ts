import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AddressHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 1 })
  history_reason: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  addressable_type: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address2: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  zip_code: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  county: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  longitude: number;

  @Column({
    type: 'point',
    nullable: true,
  })
  coordinates: { latitude: string; longitude: string } | string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  addressable_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;
}
