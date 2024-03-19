import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Drives } from './drives.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Accounts } from 'src/api/crm/accounts/entities/accounts.entity';

@Entity('drives_donor_comms_supp_accounts')
export class DrivesDonorCommunicationSupplementalAccounts {
  @ManyToOne(() => Drives, (drive) => drive.id, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'drive_id' })
  drive: Drives;

  @Column({ type: 'int', nullable: false, primary: true })
  drive_id: bigint;

  @ManyToOne(() => Accounts, (account) => account.id, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Accounts;

  @Column({ type: 'int', nullable: false, primary: true })
  account_id: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;
}
