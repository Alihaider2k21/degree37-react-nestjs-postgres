import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { OrganizationalLevels } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import {
  FavoriteCalendarPreviewTypeEnum,
  FavoriteLocationTypeEnum,
  FavoriteOperationTypeEnum,
} from '../enum/manage-favorites.enum';
import { Products } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/products/entities/products.entity';
import { Procedure } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/entities/procedure.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';

@Entity('favorites')
export class Favorites extends GenericEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  alternate_name: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => Products, (product) => product.id, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product_id: Products;

  @ManyToOne(() => Procedure, (procedure) => procedure.id, { nullable: false })
  @JoinColumn({ name: 'procedure_id' })
  procedure_id: Procedure;

  @ManyToOne(() => OperationsStatus, (operationStatus) => operationStatus.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'operations_status_id' })
  operations_status_id: OperationsStatus;

  @ManyToOne(() => OrganizationalLevels, (tenant) => tenant.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'organization_level_id' })
  organization_level_id: OrganizationalLevels;

  @Column({
    type: 'enum',
    enum: FavoriteCalendarPreviewTypeEnum,
    default: FavoriteCalendarPreviewTypeEnum.Month,
  })
  preview_in_calendar: FavoriteCalendarPreviewTypeEnum;

  @Column({
    type: 'enum',
    enum: FavoriteLocationTypeEnum,
  })
  location_type: FavoriteLocationTypeEnum;

  @Column({
    type: 'enum',
    enum: FavoriteOperationTypeEnum,
  })
  operation_type: FavoriteOperationTypeEnum;

  @Column({ type: 'bool', nullable: true, default: true })
  status: boolean;

  @Column({ type: 'bool', nullable: true, default: false })
  is_default: boolean;

  @Column({ type: 'bool', nullable: true })
  is_open_in_new_tab: boolean;
}
