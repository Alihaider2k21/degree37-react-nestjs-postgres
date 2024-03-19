import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericHistoryEntity } from '../../../../../common/entities/generic-history.entity';

@Entity('staff_shift_schedule_history')
export class StaffShiftScheduleHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  staff_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'time', nullable: false })
  monday_start_time: string;

  @Column({ type: 'time', nullable: false })
  monday_end_time: string;

  @Column({ type: 'time', nullable: false })
  tuesday_start_time: string;

  @Column({ type: 'time', nullable: false })
  tuesday_end_time: string;

  @Column({ type: 'time', nullable: false })
  wednesday_start_time: string;

  @Column({ type: 'time', nullable: false })
  wednesday_end_time: string;

  @Column({ type: 'time', nullable: false })
  thursday_start_time: string;

  @Column({ type: 'time', nullable: false })
  thursday_end_time: string;

  @Column({ type: 'time', nullable: false })
  friday_start_time: string;

  @Column({ type: 'time', nullable: false })
  friday_end_time: string;

  @Column({ type: 'time', nullable: false })
  saturday_start_time: string;

  @Column({ type: 'time', nullable: false })
  saturday_end_time: string;

  @Column({ type: 'time', nullable: false })
  sunday_start_time: string;

  @Column({ type: 'time', nullable: false })
  sunday_end_time: string;
}
