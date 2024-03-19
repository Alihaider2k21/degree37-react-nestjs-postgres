import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class ResourceSharings extends GenericEntity {
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'int', nullable: false })
  share_type: number;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'from_collection_operation_id' })
  from_collection_operation_id: BusinessUnits;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'to_collection_operation_id' })
  to_collection_operation_id: BusinessUnits;
}
