import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Shifts } from './shifts.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { type } from 'os';

@Entity()
export class ShiftsVehicles {
  @ManyToOne(() => Shifts, (shift) => shift.id, { nullable: true })
  @JoinColumn({ name: 'shift_id' })
  shift: Shifts;

  @Column({ type: 'int', nullable: false, primary: true })
  shift_id: bigint;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ type: 'int', nullable: false, primary: true })
  vehicle_id: bigint;

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
