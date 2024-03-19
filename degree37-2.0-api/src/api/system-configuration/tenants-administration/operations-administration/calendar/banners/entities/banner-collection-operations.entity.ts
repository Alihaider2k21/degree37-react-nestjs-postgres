import { User } from '../../../../user-administration/user/entity/user.entity';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Banner } from './banner.entity';
import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';

@Entity('banner_collection_operations')
export class BannerCollectionOperation extends GenericEntity {
  @ManyToOne(() => Banner, (banner) => banner.id, { nullable: false })
  @JoinColumn({ name: 'banner_id' })
  banner_id: bigint;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation_id' })
  collection_operation_id: bigint;
}
