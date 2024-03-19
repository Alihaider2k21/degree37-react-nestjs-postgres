import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Shifts } from './shifts.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { StaffSetup } from 'src/api/system-configuration/tenants-administration/staffing-administration/staff-setups/entity/staffSetup.entity';

@Entity()
export class ShiftsStaffSetups {
  @PrimaryColumn({ type: 'bigint' })
  @ManyToOne(() => Shifts, (shift) => shift.id, { nullable: false })
  @JoinColumn({ name: 'shift_id' })
  shift_id: Shifts;

  @PrimaryColumn({ type: 'bigint' })
  @ManyToOne(() => StaffSetup, (staff_setup) => staff_setup.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'staff_setup_id' })
  staff_setup_id: bigint;

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
