import { Entity, Column } from 'typeorm';
import {
  appliesToTypeEnum,
  fieldDataTypeEnum,
} from '../enum/custom-field.enum';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class CustomFieldsHistory extends GenericHistoryEntity {
  @Column({
    type: 'enum',
    enum: appliesToTypeEnum,
  })
  field_data_type: appliesToTypeEnum;

  //   @Column({ type: "bigint", nullable: true })
  //   applies_to: bigint;
  @Column({
    type: 'enum',
    enum: fieldDataTypeEnum,
  })
  applies_to: fieldDataTypeEnum;

  @Column({ type: 'varchar', length: 60, nullable: false })
  field_name: string;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_required: boolean;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;
}
