import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { StaffSetup } from './staffSetup.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { ContactsRoles } from '../../../crm-administration/contacts/role/entities/contacts-role.entity';

@Entity()
export class StaffConfig {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'int' })
  qty: number;

  @Column({ type: 'int' })
  lead_time: number;

  @Column({ type: 'int' })
  setup_time: number;

  @Column({ type: 'int' })
  breakdown_time: number;

  @Column({ type: 'int' })
  wrapup_time: number;

  /*  @Column({ type: 'int' })
  staff_setup_id: bigint; */
  @ManyToOne(() => StaffSetup, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'staff_setup_id' })
  staff_setup_id: bigint;

  @ManyToOne(() => ContactsRoles, (constactRole) => constactRole.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'contact_role_id' })
  contact_role_id: bigint;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
