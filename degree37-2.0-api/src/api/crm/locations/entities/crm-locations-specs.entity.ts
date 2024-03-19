import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { GenericEntity } from '../../../common/entities/generic.entity';
import { CrmLocations } from './crm-locations.entity';
import { RoomSize } from '../../../system-configuration/tenants-administration/crm-administration/locations/room-sizes/entity/roomsizes.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('crm_locations_specs')
export class CrmLocationsSpecs extends GenericEntity {
  @ManyToOne(() => CrmLocations, (crmLocations) => crmLocations.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'location_id' })
  location_id: CrmLocations;

  // @Column({ type: "bigint", nullable: false })
  @ManyToOne(() => RoomSize, (roomSize) => roomSize.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'room_size_id' })
  room_size_id: RoomSize;

  @Column({ type: 'varchar', length: 150, nullable: false })
  elevator: string;

  @Column({ type: 'bigint', nullable: true })
  inside_stairs: bigint;

  @Column({ type: 'bigint', nullable: true })
  outside_stairs: bigint;

  @Column({ type: 'varchar', length: 225, nullable: true })
  electrical_note: string;

  @Column({ type: 'varchar', length: 225, nullable: true })
  special_instructions: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
