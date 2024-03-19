import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterStaffShiftScheduleHistoryTable1699467276000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'staff_shift_schedule_history',
      'classification_settings_id'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'staff_shift_schedule_history',
      new TableColumn({
        name: 'classification_settings_id',
        type: 'bigint',
        isNullable: false,
      })
    );
  }
}
