import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import {
  appliesToTypeEnum,
  fieldDataTypeEnum,
} from '../enum/custom-field.enum';
import { PickLists } from './pick-lists.entity';

@Entity()
export class CustomFields extends GenericEntity {
  @Column({
    type: 'enum',
    enum: fieldDataTypeEnum,
  })
  field_data_type: fieldDataTypeEnum;

  //   @Column({ type: "bigint", nullable: true })
  //   applies_to: bigint;
  @Column({
    type: 'enum',
    enum: appliesToTypeEnum,
  })
  applies_to: appliesToTypeEnum;

  @Column({ type: 'varchar', length: 60, nullable: false })
  field_name: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_required: boolean;

  @OneToMany(() => PickLists, (picklist) => picklist.custom_field_id, {
    nullable: false,
  })
  pick_list: PickLists[];
}
