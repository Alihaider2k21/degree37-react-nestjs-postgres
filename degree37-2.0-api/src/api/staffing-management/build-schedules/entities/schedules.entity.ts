import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export enum ScheduleStatusEnum {
  Draft = 'Draft',
  Published = 'Published',
}

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;
  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation_id' })
  collection_operation_id: bigint;

  @ManyToMany(() => OperationsStatus)
  @JoinTable({
    name: 'schedules_operation_statuses',
    joinColumn: {
      name: 'schedule_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'operation_status_id',
      referencedColumnName: 'id',
    },
  })
  operation_status: OperationsStatus[];

  @Column({ default: ScheduleStatusEnum.Draft })
  schedule_status: ScheduleStatusEnum;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ default: false })
  is_locked: boolean;

  @Column({ default: false })
  is_paused: boolean;

  @Column({ default: false })
  is_flagged: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;
}
