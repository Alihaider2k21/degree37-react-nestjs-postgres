import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PromotionalItems } from './promotional-item.entity';
import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';

@Entity('promotionalItem_collection_operations')
export class PromotionalItemCollectionOperation extends GenericEntity {
  @ManyToOne(
    () => PromotionalItems,
    (PromotionalItems) => PromotionalItems.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'promotional_item_id' })
  promotional_item: PromotionalItems;

  @Column({ nullable: true })
  promotional_item_id: bigint;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation_id' })
  collection_operation: BusinessUnits;

  @Column({ nullable: true })
  collection_operation_id: bigint;
}
