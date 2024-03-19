import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GenericEntity } from '../../../common/entities/generic.entity';
import { CRMVolunteer } from '../../contacts/volunteer/entities/crm-volunteer.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { CrmLocationsSpecs } from './crm-locations-specs.entity';
import { Directions } from '../directions/entities/direction.entity';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';

@Entity('crm_locations')
export class CrmLocations extends GenericEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  cross_street: string;

  @OneToMany(
    () => CrmLocationsSpecs,
    (crmLocationsSpecs) => crmLocationsSpecs.location_id,
    {
      nullable: true,
    }
  )
  @JoinColumn({ name: 'crm_locations_specs' })
  crm_locations_specs: CrmLocationsSpecs;

  @Column({ type: 'varchar', length: 60, nullable: true })
  floor: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  room: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  room_phone: string;

  @ManyToOne(() => CRMVolunteer, (crmVolunteer) => crmVolunteer.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'site_contact_id' })
  site_contact_id: CRMVolunteer;

  @Column({ type: 'bigint', nullable: true })
  becs_code: bigint;

  @Column({ type: 'varchar', length: 150, nullable: false })
  site_type: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  qualification_status: string;

  @Column({ type: 'boolean', nullable: false })
  is_active: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @OneToMany(() => Directions, (directions) => directions.location_id, {
    nullable: true,
  })
  directions: Directions;

  @OneToMany(() => Drives, (drive) => drive.location, { nullable: false })
  @JoinColumn({ name: 'drives' })
  drives: Drives;
}
