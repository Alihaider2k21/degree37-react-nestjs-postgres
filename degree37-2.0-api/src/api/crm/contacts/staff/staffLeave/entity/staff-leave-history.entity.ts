import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from '../../../../../common/entities/generic-history.entity';
import { StaffLeaveType } from '../enum/staff-leave-type.enum';

@Entity()
export class StaffLeaveHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint' })
  staff_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'enum', enum: StaffLeaveType })
  type: StaffLeaveType;

  @Column({ type: 'date' })
  begin_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'int' })
  hours: number;

  @Column({ type: 'text' })
  note: string;
}
