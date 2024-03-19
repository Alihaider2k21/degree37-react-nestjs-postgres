export class StaffScheduleInfoDto {
  staff_id: number;
  staff_name: string;
  role_name: string;
  date: Date;
  shift_start_time: Date;
  shift_end_time: Date;
  depart_time: Date;
  return_time: Date;
  total_hours: number;
  account_name: string;
  location_address: string;
  vehicle_name: string;
  is_on_leave: boolean;
}
