import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TenantConfigurationDetailHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 1 })
  history_reason: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  element_name: string;

  @Column({ type: 'text', nullable: false })
  end_point_url: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  secret_key: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  secret_value: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;
}
