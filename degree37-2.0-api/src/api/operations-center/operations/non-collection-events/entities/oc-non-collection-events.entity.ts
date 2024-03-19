import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from '../../../../common/entities/generic.entity';
import { Category } from 'src/api/system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { CrmLocations } from 'src/api/crm/locations/entities/crm-locations.entity';
import { CrmNonCollectionProfiles } from 'src/api/crm/crm-non-collection-profiles/entities/crm-non-collection-profiles.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { ApprovalStatusEnum } from '../enums';

@Entity('oc_non_collection_events')
export class NonCollectionEvents extends GenericEntity {
  @Column({ type: Date, nullable: false })
  date: Date;

  @Column({ type: 'varchar', nullable: false })
  event_name: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner_id: User;

  @ManyToOne(() => CrmNonCollectionProfiles, (location) => location.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'non_collection_profile_id' })
  non_collection_profile_id: CrmNonCollectionProfiles;

  @ManyToOne(() => CrmLocations, (location) => location.id, { nullable: false })
  @JoinColumn({ name: 'location_id' })
  location_id: CrmLocations;

  @ManyToOne(() => BusinessUnits, (unit) => unit.id, { nullable: false })
  @JoinColumn({ name: 'collection_operation_id' })
  collection_operation_id: BusinessUnits;

  @Column({
    type: 'enum',
    enum: ApprovalStatusEnum,
    default: ApprovalStatusEnum.APPROVED,
    nullable: false,
  })
  approval_status: ApprovalStatusEnum;

  @ManyToOne(
    () => OperationsStatus,
    (operation_status) => operation_status.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'status_id' })
  status_id: OperationsStatus;

  @ManyToOne(() => Category, (category) => category.id, { nullable: false })
  @JoinColumn({ name: 'event_category_id' })
  event_category_id: Category;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true })
  @JoinColumn({ name: 'event_subcategory_id' })
  event_subcategory_id: Category;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: bigint;
}
