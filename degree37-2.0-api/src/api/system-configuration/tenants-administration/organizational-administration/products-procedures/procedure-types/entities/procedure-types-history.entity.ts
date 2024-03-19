import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProcedureTypesHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  short_description: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ default: false, nullable: false })
  is_goal_type: boolean;

  @Column({ type: 'bigint', nullable: true })
  beds_per_staff: bigint;

  @Column({ type: 'bigint', nullable: false })
  procedure_duration: bigint;

  @Column({ default: false, nullable: false })
  is_generate_online_appointments: boolean;

  @Column({ default: false, nullable: false })
  is_active: boolean;

  @Column({ default: false, nullable: true })
  is_archive: boolean;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'bigint', nullable: true })
  created_by: bigint;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;
}
