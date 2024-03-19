import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { appliesToTypeEnum } from '../enum/custom-field.enum';
import { CustomFields } from './custom-field.entity';

@Entity()
export class PickLists extends GenericEntity {
  //   @Column({ type: "bigint", nullable: true })
  //   applies_to: bigint;
  @Column({
    type: 'enum',
    enum: appliesToTypeEnum,
  })
  applies_to: appliesToTypeEnum;

  @Column({ type: 'varchar', length: 60, nullable: false })
  type_name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  type_value: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => CustomFields, (customFields) => customFields.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'custom_field_id' })
  custom_field_id: CustomFields;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: true })
  sort_order: bigint;
}
