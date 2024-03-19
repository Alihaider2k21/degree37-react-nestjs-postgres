import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterStaffShiftScheduleAndHistoryTable1699467276001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'staff_shift_schedule',
      'target_hours_per_week'
    );

    await queryRunner.dropColumn(
      'staff_shift_schedule_history',
      'target_hours_per_week'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'staff_shift_schedule',
      new TableColumn({
        name: 'target_hours_per_week',
        type: 'int',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'staff_shift_schedule_history',
      new TableColumn({
        name: 'target_hours_per_week',
        type: 'int',
        isNullable: false,
      })
    );
  }
}
