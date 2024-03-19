import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('user_business_units_history')
export class UserBusinessUnitsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  user_id?: bigint;

  @Column({ type: 'bigint', nullable: false })
  business_unit_id: bigint;
}
