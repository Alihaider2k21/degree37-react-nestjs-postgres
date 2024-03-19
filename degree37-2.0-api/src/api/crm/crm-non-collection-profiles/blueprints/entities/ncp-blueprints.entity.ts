import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { CrmNonCollectionProfiles } from '../../entities/crm-non-collection-profiles.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { CrmLocations } from 'src/api/crm/locations/entities/crm-locations.entity';

@Entity('crm_ncp_blueprints')
export class CrmNcpBluePrints extends GenericEntity {
  @ManyToOne(() => CrmNonCollectionProfiles, (ncp) => ncp.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'crm_non_collection_profiles_id' })
  crm_non_collection_profiles_id: CrmNonCollectionProfiles;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @Column({ type: 'varchar', length: 100, nullable: true })
  blueprint_name: string;

  @ManyToOne(() => CrmLocations, (location) => location.id, { nullable: false })
  @JoinColumn({ name: 'location_id' })
  location_id: CrmLocations;

  @Column({ type: 'text', nullable: true })
  additional_info: string;

  @Column({ type: 'boolean', default: false })
  id_default: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
