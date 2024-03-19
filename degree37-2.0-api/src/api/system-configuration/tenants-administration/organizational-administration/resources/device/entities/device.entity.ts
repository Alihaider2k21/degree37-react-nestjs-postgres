import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeviceType } from '../../device-type/entity/device-type.entity';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  short_name: string;

  @Column({ nullable: false })
  description: string;

  @ManyToOne(() => DeviceType, (deviceType) => deviceType.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'device_type_id' })
  device_type: bigint;

  @ManyToOne(() => Device, (device) => device.id, { nullable: true })
  @JoinColumn({ name: 'replace_device' })
  replace_device: bigint;

  @Column({ nullable: true })
  retire_on: Date;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'collection_operation' })
  collection_operation: bigint;

  @Column({ default: true })
  status: boolean;

  @Column({ default: false })
  is_archived: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  // @ManyToOne(() => User, (user) => user.id, { nullable: true })
  // @JoinColumn({name:'updated_by'})
  // updated_by?: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
  // @UpdateDateColumn({ nullable: false, type: 'timestamp' })
  // updated_at: Date;
}
