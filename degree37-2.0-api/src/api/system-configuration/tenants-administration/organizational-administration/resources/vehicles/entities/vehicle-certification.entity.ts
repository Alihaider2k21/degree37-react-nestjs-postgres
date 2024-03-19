import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Certification } from '../../../../staffing-administration/certification/entity/certification.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class VehicleCertification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id, { nullable: false })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle_id: bigint;

  @ManyToOne(() => Certification, (certif) => certif.id, { nullable: false })
  @JoinColumn({ name: 'certification_id' })
  certification: Certification;

  @Column({ type: 'bigint', nullable: false })
  certification_id: bigint;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
