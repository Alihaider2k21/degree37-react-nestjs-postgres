import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Schedule } from './schedules.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';

@Entity()
export class ScheduleOperationStatus {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => Schedule, (schedule) => schedule.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule_id: bigint;

  @ManyToOne(
    () => OperationsStatus,
    (operation_status) => operation_status.id,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'operation_status_id' })
  operation_status_id: bigint;

  @Column({ default: false })
  is_archived: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;
}
