import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from '../../../../common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { ApprovalStatusEnum } from '../../drives/enums';

@Entity('sessions')
export class Sessions extends GenericEntity {
  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint' })
  tenant_id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => Facility, (facility) => facility.id, { nullable: true })
  @JoinColumn({ name: 'donor_center_id' })
  donor_center: Facility;

  @Column({ type: 'bigint' })
  donor_center_id: number;

  @ManyToOne(
    () => OperationsStatus,
    (operation_status) => operation_status.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'operation_status_id' })
  operation_status: OperationsStatus;

  @Column({ type: 'bigint' })
  operation_status_id: number;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation_id' })
  collection_operation: BusinessUnits;

  @Column({ type: 'bigint' })
  collection_operation_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  oef_products: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  oef_procedures: number;

  @Column({ type: 'enum', enum: ApprovalStatusEnum })
  approval_status: ApprovalStatusEnum;
}
