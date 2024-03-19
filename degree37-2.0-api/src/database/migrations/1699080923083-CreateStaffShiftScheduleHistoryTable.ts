import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import genericHistoryColumns from '../common/generic-history-columns';

export class CreateStaffShiftScheduleHistoryTable1699080923071
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_shift_schedule_history',
        columns: [
          ...genericHistoryColumns,
          {
            name: 'staff_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'classification_settings_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'target_hours_per_week',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'monday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'monday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'tuesday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'tuesday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'wednesday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'wednesday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'thursday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'thursday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'friday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'friday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'saturday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'saturday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'sunday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'sunday_end_time',
            type: 'time',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('staff_shift_schedule_history');
  }
}
