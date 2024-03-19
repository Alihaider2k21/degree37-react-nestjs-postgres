import { StaffLeaveType } from '../enum/staff-leave-type.enum';

export interface FilterStaffLeave {
  staff_id: bigint;
  type?: StaffLeaveType;
  begin_date?: Date;
  end_date?: Date;
  period?: string;
}
