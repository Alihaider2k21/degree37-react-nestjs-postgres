import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
@Entity()
export class TeamHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: true })
  id: bigint;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  short_description: string;

  @Column({ type: 'bigint', array: true, nullable: false })
  collection_operations: Array<bigint>;

  @Column()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ type: 'bigint', nullable: true })
  created_by: bigint;

  @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  history_reason?: string;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
