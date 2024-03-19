import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PromotionEntity } from '../../promotions/entity/promotions.entity';
import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';

@Entity()
export class PromotionalItemsHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  short_name: string;

  @ManyToOne(() => PromotionEntity, (promotion) => promotion.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'promotion_id' })
  promotion_id: bigint;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ default: false })
  status: boolean;

  @Column({
    type: 'date',
    nullable: true,
  })
  retire_on: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'bigint', array: true, nullable: false })
  collection_operations: Array<bigint>;
}
