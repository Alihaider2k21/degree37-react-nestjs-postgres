import { Entity, Column } from 'typeorm';
import { LocationTypeEnum, OperationTypeEnum } from '../enum/type';
import { GenericHistoryEntity } from '../../../../../common/entities/generic-history.entity';

@Entity()
export class StaffSetupHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  short_name: string;

  @Column({ type: 'int', default: 1 })
  beds: number;

  @Column({ type: 'int', default: 1 })
  concurrent_beds: number;

  @Column({ type: 'int', default: 1 })
  stagger_slots: number;

  @Column({ type: 'varchar' })
  opeartion_type_id: OperationTypeEnum;

  @Column({ type: 'varchar', nullable: true })
  location_type_id: LocationTypeEnum;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
