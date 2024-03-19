import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import {
  appliesToTypeEnum,
  fieldDataTypeEnum,
} from '../enum/custom-field.enum';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class CustomFieldsDataHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  custom_field_datable_type: string;

  @Column({ type: 'bigint', nullable: true })
  custom_field_datable_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  field_id: bigint;

  @Column({ type: 'text', nullable: true })
  field_data: string;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
