import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { Staff } from '../../entities/staff.entity';

@Entity()
export class StaffRolesMapping extends GenericEntity {
  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staff_id: Staff;

  @ManyToOne(() => ContactsRoles, (contactsRoles) => contactsRoles.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'role_id' })
  role_id: ContactsRoles;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
