import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProcedureHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'bigint', nullable: true })
  procedure_type_id: bigint;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ default: false, nullable: false })
  is_active: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  external_reference: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ default: false, nullable: true })
  is_archive: boolean;

  @Column({ type: 'bigint', nullable: true })
  created_by: bigint;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;
}
