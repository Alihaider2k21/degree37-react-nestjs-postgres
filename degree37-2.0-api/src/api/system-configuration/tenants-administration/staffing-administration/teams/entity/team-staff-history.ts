import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('team_staff_history')
export class TeamStaffHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint' })
  team_id: bigint;

  @Column({ type: 'bigint' })
  staff_id: bigint;

  @Column({ type: 'bigint' })
  created_by: bigint;

  @Column()
  history_reason: string;

  @Column({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;

  @Column()
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
