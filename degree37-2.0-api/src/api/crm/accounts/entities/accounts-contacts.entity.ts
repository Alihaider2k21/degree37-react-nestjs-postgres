import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Accounts } from './accounts.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { CRMVolunteer } from '../../contacts/volunteer/entities/crm-volunteer.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';

@Entity('account_contacts')
export class AccountContacts extends GenericEntity {
  @ManyToOne(() => CRMVolunteer, (contact) => contact.id, { nullable: false })
  @JoinColumn({ name: 'record_id' })
  record_id: bigint;

  @ManyToOne(() => Accounts, (account) => account.id, { nullable: false })
  @JoinColumn({ name: 'contactable_id' })
  contactable_id: bigint;

  @ManyToOne(() => ContactsRoles, (role) => role.id, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role_id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  contactable_type: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: null,
    nullable: true,
  })
  closeout_date: Date;
}
