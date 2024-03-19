import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';

@Entity('user_business_units')
export class UserBusinessUnits extends GenericEntity {
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user_id?: bigint;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'business_unit_id' })
  business_unit_id: bigint;
}
