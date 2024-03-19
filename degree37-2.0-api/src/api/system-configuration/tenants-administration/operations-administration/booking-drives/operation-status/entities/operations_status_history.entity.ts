import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { appliesToEnum } from '../enums/operation-status.enum';

@Entity()
export class OperationsStatusHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  chip_color: string;

  @Column({
    type: 'enum',
    enum: appliesToEnum,
    nullable: false,
    array: true,
    default: [appliesToEnum.drives],
  })
  applies_to: Array<appliesToEnum>;

  @Column({ nullable: false, default: true })
  schedulable: boolean;

  @Column({ nullable: false, default: true })
  hold_resources: boolean;

  @Column({ nullable: false, default: true })
  contribute_to_scheduled: boolean;

  @Column({ nullable: false, default: true })
  requires_approval: boolean;

  @Column({ nullable: false, default: false })
  is_archived: boolean;

  @Column({ nullable: false, default: true })
  is_active: boolean;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'bigint', nullable: true })
  created_by: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
