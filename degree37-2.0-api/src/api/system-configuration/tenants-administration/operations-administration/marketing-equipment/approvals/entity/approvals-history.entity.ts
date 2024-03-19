import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AprovalsHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ nullable: true })
  promotional_items: boolean;

  @Column({ nullable: true })
  marketing_materials: boolean;

  @Column({ nullable: true })
  tele_recruitment: boolean;

  @Column({ nullable: true })
  email: boolean;

  @Column({ nullable: false })
  sms_texting: boolean;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'bigint' })
  created_by_id: number;
  @Column({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'bigint', nullable: false })
  updated_by?: number;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
