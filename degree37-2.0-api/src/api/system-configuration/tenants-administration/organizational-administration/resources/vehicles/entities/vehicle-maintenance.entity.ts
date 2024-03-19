import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class VehicleMaintenance {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id, { nullable: false })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle_id: bigint;

  @Column({ type: 'timestamptz', nullable: false })
  start_date_time: Date;

  @Column({ type: 'timestamptz', nullable: false })
  end_date_time: Date;

  @Column({ nullable: false })
  description: string;

  @Column({ default: true })
  prevent_booking: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
