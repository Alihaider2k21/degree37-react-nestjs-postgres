import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../../../../user-administration/user/entity/user.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { PromotionsCollectionOperation } from './promotions-collection-operations.entity';

@Entity()
export class PromotionEntity extends GenericEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  donor_message: string;

  @Column({ type: 'date', nullable: false })
  start_date: string;

  @Column({ type: 'date', nullable: false })
  end_date: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;

  @OneToMany(
    () => PromotionsCollectionOperation,
    (promotions_collection_operations) =>
      promotions_collection_operations.promotion_id,
    {
      nullable: false,
    }
  )
  promotions_collection_operations: PromotionsCollectionOperation;
}
