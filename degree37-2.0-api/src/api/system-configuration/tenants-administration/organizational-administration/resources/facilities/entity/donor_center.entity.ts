import { User } from '../../../../user-administration/user/entity/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { OrganizationalLevels } from '../../../hierarchy/organizational-levels/entities/organizational-level.entity';

@Entity()
export class DonorCenterFilter extends GenericEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  state: string;

  @ManyToOne(() => BusinessUnits, (businessUnits) => businessUnits.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation' })
  collection_operation_id: BusinessUnits;

  @Column({ default: false })
  staging_site: boolean;

  @ManyToOne(
    () => OrganizationalLevels,
    (organizationalLevel) => organizationalLevel.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'organizational_level' })
  organizational_level_id: OrganizationalLevels;

  @Column({ default: false })
  is_active: boolean;
}
