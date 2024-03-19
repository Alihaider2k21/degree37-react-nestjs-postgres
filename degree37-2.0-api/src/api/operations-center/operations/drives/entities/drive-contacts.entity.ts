import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { GenericEntity } from '../../../../common/entities/generic.entity';
import { Drives } from './drives.entity';
import { AccountContacts } from 'src/api/crm/accounts/entities/accounts-contacts.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';

@Entity('drives_contacts')
export class DrivesContacts extends GenericEntity {
  @ManyToOne(() => Drives, (drive) => drive.id, { nullable: false })
  @JoinColumn({ name: 'drive_id' })
  drive: Drives;

  @Column({ type: 'bigint' })
  drive_id: bigint;

  @ManyToOne(
    () => AccountContacts,
    (accounts_contacts) => accounts_contacts.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'accounts_contacts_id' })
  accounts_contacts: AccountContacts;

  @Column({ type: 'bigint' })
  accounts_contacts_id: bigint;

  @ManyToOne(() => ContactsRoles, (contact_roles) => contact_roles.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role: ContactsRoles;

  @Column({ type: 'bigint' })
  role_id: bigint;
}
