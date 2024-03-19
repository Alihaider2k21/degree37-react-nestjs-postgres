import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { LockDate } from './lock-date.entity';
import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';

@Entity('lock_date_collection_operations')
export class LockDateCollectionOperation extends GenericEntity {
  @ManyToOne(() => LockDate, (lock_dates) => lock_dates.id, { nullable: false })
  @JoinColumn({ name: 'lock_date_id' })
  lock_date_id: bigint;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation_id' })
  collection_operation_id: bigint;
}
