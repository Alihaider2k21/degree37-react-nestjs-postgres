import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../../../system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { Tenant } from '../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { CrmLocations } from '../../entities/crm-locations.entity';

@Entity('location_directions')
export class Directions {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => BusinessUnits, (unit) => unit.id, { nullable: false })
  @JoinColumn({ name: 'collection_operation_id' })
  collection_operation_id: BusinessUnits | bigint;

  @ManyToOne(() => CrmLocations, (location) => location.id, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location_id: CrmLocations;

  @Column({ type: 'text', nullable: true })
  direction: string;

  @Column({ type: 'float' })
  miles: number;

  @Column({ type: 'float' })
  minutes: number;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
