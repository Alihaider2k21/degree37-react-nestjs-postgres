import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';

@Entity('shifts_roles')
export class ShiftsRoles {
  @ManyToOne(() => Shifts, (shift) => shift.id, { nullable: true })
  @JoinColumn({ name: 'shift_id' })
  shift: Shifts;

  @Column({ type: 'int', nullable: false, primary: true })
  shift_id: bigint;

  @ManyToOne(() => ContactsRoles, (contantRoles) => contantRoles.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: ContactsRoles;

  @Column({ type: 'int', nullable: false, primary: true })
  role_id: bigint;

  @Column({ type: 'int', nullable: false })
  quantity: bigint;

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
