import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class AffiliationHistory {
  @PrimaryGeneratedColumn()
  rowkey: bigint;

  @Column()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'bigint', nullable: true })
  collection_operation_id: bigint;

  @Column()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ type: 'bigint', nullable: true })
  created_by: bigint;

  @Column({ nullable: true })
  created_at: Date;

  @Column({ nullable: true })
  history_reason?: string;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
