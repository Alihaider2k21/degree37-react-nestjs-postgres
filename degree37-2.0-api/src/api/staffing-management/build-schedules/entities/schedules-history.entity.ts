import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

enum ScheduleStatusEnum {
  Draft = 'Draft',
  Published = 'Published',
}
@Entity()
export class SchedulesHistory extends GenericHistoryEntity {
  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ type: 'bigint', nullable: true })
  collection_operation_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  operations_status_id: bigint;

  @Column({ default: ScheduleStatusEnum.Draft })
  schedule_status: ScheduleStatusEnum;

  @Column({ type: 'boolean', default: false })
  is_locked: boolean;

  @Column({ type: 'boolean', default: false })
  is_paused: boolean;

  @Column({ type: 'boolean', default: false })
  is_flagged: boolean;
}
