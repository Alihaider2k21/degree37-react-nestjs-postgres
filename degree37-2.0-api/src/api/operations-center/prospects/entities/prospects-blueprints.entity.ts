import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Prospects } from './prospects.entity';
import { Drives } from '../../operations/drives/entities/drives.entity';

@Entity('prospects_blueprints')
export class ProspectsBlueprints extends GenericEntity {
  @ManyToOne(() => Prospects, (prospect) => prospect.id, { nullable: false })
  @JoinColumn({ name: 'prospect_id' })
  prospect_id: Prospects;

  @ManyToOne(() => Drives, (drive) => drive.id, { nullable: false })
  @JoinColumn({ name: 'blueprint_id' })
  blueprint_id: Drives;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
