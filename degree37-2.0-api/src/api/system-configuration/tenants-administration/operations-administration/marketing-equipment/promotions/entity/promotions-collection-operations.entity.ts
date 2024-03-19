import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { PromotionEntity } from './promotions.entity';

@Entity('promotions_collection_operations')
export class PromotionsCollectionOperation extends GenericEntity {
  @ManyToOne(() => PromotionEntity, (promotion) => promotion.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'promotion_id' })
  promotion_id: bigint;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation_id' })
  collection_operation_id: bigint;
}
