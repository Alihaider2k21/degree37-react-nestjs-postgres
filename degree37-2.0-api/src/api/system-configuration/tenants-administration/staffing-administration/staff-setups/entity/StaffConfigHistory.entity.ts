import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ContactsRoles } from '../../../crm-administration/contacts/role/entities/contacts-role.entity';

@Entity()
export class StaffConfigHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'bigint', nullable: false })
  staff_config_id: bigint;

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

  @ManyToOne(() => ContactsRoles, (contactRole) => contactRole.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'contact_role_id' })
  contact_role_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
