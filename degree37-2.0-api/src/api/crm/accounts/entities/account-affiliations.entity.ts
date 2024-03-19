import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Accounts } from './accounts.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Staff } from '../../contacts/staff/entities/staff.entity';
import { Affiliation } from 'src/api/system-configuration/tenants-administration/crm-administration/account/affiliation/entity/affiliation.entity';

@Entity('account_affiliations')
export class AccountAffiliations extends GenericEntity {
  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: bigint;

  @ManyToOne(() => Accounts, (account) => account.id, { nullable: false })
  @JoinColumn({ name: 'account_id' })
  account_id: bigint;

  @ManyToOne(() => Affiliation, (affiliation) => affiliation.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'affiliation_id' })
  affiliation_id: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: null,
    nullable: true,
  })
  closeout_date: Date;
}
