import { Entity, Column } from 'typeorm';
import { appliesToTypeEnum } from '../enum/custom-field.enum';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class PickListsHistory extends GenericHistoryEntity {
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

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  custom_field_id: bigint;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;
}
