import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import {
  appliesToTypeEnum,
  fieldDataTypeEnum,
} from '../enum/custom-field.enum';
import { CustomFields } from './custom-field.entity';

@Entity()
export class CustomFieldsData extends GenericEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  custom_field_datable_type: string;

  @Column({ type: 'bigint', nullable: true })
  custom_field_datable_id: bigint;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => CustomFields, (customFields) => customFields.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'field_id' })
  field_id: CustomFields;

  @Column({ type: 'text', nullable: true })
  field_data: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
