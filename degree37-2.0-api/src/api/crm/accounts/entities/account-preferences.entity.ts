import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Accounts } from './accounts.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Staff } from '../../contacts/staff/entities/staff.entity';

@Entity('account_preferences')
export class AccountPreferences extends GenericEntity {
  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: bigint;

  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff_id: bigint;

  @ManyToOne(() => Accounts, (account) => account.id, { nullable: false })
  @JoinColumn({ name: 'account_id' })
  account_id: bigint;

  @Column({ type: 'int', nullable: false })
  preference: number;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  assigned_date: Date;

  @Column({ nullable: false, default: true })
  is_active: boolean;
}
