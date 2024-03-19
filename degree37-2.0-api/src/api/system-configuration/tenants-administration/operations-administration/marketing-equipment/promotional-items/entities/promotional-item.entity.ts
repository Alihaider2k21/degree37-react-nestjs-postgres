import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { PromotionEntity } from '../../promotions/entity/promotions.entity';
import { GenericEntity } from '../../../../../../common/entities/generic.entity';
import { PromotionalItemCollectionOperation } from './promotional-item-collection-operations.entity';

@Entity()
export class PromotionalItems extends GenericEntity {
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

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @OneToMany(
    () => PromotionalItemCollectionOperation,
    (promotionalItemCollectionOperation) =>
      promotionalItemCollectionOperation.promotional_item,
    {
      nullable: false,
    }
  )
  promotionalItem_collection_operations: PromotionalItemCollectionOperation[];
}
