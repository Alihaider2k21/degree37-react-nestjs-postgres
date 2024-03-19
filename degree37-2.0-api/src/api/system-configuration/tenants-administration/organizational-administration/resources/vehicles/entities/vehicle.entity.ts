import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VehicleType } from '../../vehicle-type/entities/vehicle-type.entity';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { ShiftsVehicles } from 'src/api/shifts/entities/shifts-vehicles.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  short_name: string;

  @Column({ nullable: false })
  description: string;

  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'vehicle_type_id' })
  vehicle_type_id: VehicleType;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id, { nullable: true })
  @JoinColumn({ name: 'replace_vehicle_id' })
  replace_vehicle_id: bigint;

  @Column({ type: 'date', nullable: true })
  retire_on: string;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation' })
  collection_operation_id: bigint;

  @Column({ type: 'bigint', nullable: false, primary: true })
  collection_operation: bigint;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false, nullable: false })
  is_archived: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  // @ManyToOne(() => User, (user) => user.id, { nullable: true })
  // @JoinColumn({name:'updated_by'})
  // updated_by?: bigint;

  // @UpdateDateColumn({ nullable: false, type: 'timestamp' })
  // updated_at: Date;

  @OneToMany(() => ShiftsVehicles, (sv) => sv.vehicle)
  shifts_vehicles: ShiftsVehicles[];
}
