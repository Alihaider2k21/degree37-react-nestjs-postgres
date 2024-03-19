import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('drives_donor_comms_supp_accounts_history')
export class DrivesDonorCommunicationSupplementalAccountsHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;
  @Column({ type: 'int', nullable: false })
  drive_id: bigint;

  @Column({ type: 'int', nullable: false })
  account_id: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;
}
