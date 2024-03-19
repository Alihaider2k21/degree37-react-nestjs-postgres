import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Tenant } from '../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../common/entities/generic.entity';
import { ShiftsProjectionsStaff } from './shifts-projections-staff.entity';
import { ShiftsStaffSetups } from './shifts-staffsetups.entity';
import { ShiftsVehicles } from './shifts-vehicles.entity';
import { ShiftsSlots } from './shifts-slots.entity';
import { ShiftsDevices } from './shifts-devices.entity';
@Entity()
export class Shifts extends GenericEntity {
  @Column({ type: 'bigint', nullable: true })
  shiftable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shiftable_type: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  start_time: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  end_time: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  break_start_time: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  break_end_time: Date;

  @Column({ type: 'double precision', nullable: true })
  reduction_percentage: number;

  @Column({ nullable: true })
  reduce_slots: boolean;

  @Column({ type: 'double precision', nullable: true })
  oef_procedures: number;

  @Column({ type: 'double precision', nullable: true })
  oef_products: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'int', nullable: false })
  tenant_id: bigint;

  @OneToMany(() => ShiftsProjectionsStaff, (proj) => proj.shift)
  projections: ShiftsProjectionsStaff[];

  @OneToMany(() => ShiftsStaffSetups, (staffSetup) => staffSetup.shift_id)
  staff_setups: ShiftsStaffSetups[];

  @OneToMany(() => ShiftsVehicles, (shiftsVehicles) => shiftsVehicles.shift, {
    nullable: true,
  })
  vehicles: ShiftsVehicles[];

  @OneToMany(() => ShiftsSlots, (shiftsSlots) => shiftsSlots.shift, {
    nullable: true,
  })
  slots: ShiftsSlots[];

  @OneToMany(() => ShiftsDevices, (shiftsDevices) => shiftsDevices.shift, {
    nullable: true,
  })
  devices: ShiftsDevices[];
}
