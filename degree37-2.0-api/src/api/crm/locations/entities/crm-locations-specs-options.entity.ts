import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { GenericEntity } from '../../../common/entities/generic.entity';
import { CrmLocations } from './crm-locations.entity';
import { CrmLocationsSpecs } from './crm-locations-specs.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('crm_locations_specs_options')
export class CrmLocationsSpecsOptions extends GenericEntity {
  @ManyToOne(
    () => CrmLocationsSpecs,
    (crmLocationsSpecs) => crmLocationsSpecs.id,
    {
      nullable: true,
    }
  )
  @JoinColumn({ name: 'location_specs_id' })
  location_specs_id: CrmLocationsSpecs;

  @Column({ type: 'varchar', length: 60, nullable: false })
  specs_key: string;

  @Column({ type: 'boolean', nullable: false })
  specs_value: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  //   @Column({ type: "bigint", nullable: false })
  //   inside_stairs: bigint;

  //   @Column({ type: "bigint", nullable: true })
  //   outside_stairs: bigint;

  //   @Column({ type: "varchar", length: 60, nullable: false })
  //   electrical_note: string;

  //   @Column({ type: "bigint", length: 60, nullable: true })
  //   special_instructions: string;

  //   @Column({ type: "varchar", length: 150, nullable: false })
  //   site_type: string;

  //   @Column({ type: "boolean", nullable: false })
  //   is_active: boolean;
}
