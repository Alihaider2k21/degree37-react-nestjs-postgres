import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MarketingMaterialsHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 1 })
  history_reason: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  short_name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ default: false })
  status: boolean;

  @Column({
    type: 'date',
    nullable: true,
  })
  retire_on: Date;

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

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
