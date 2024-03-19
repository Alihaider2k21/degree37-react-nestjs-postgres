import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { enumShareTypes } from '../interface/vehicle.interface';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class VehicleShare {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id, { nullable: false })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle_id: bigint;

  @Column({ type: 'timestamptz', nullable: false })
  start_date: Date;

  @Column({ type: 'timestamptz', nullable: false })
  end_date: Date;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'from' })
  from: bigint;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'to' })
  to: bigint;

  @Column({
    type: 'enum',
    enum: enumShareTypes,
    default: enumShareTypes.vehicle,
  })
  share_type: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
