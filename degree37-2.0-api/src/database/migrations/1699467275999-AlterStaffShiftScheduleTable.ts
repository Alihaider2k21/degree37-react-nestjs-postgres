import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterStaffShiftScheduleTable1699467275999
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    await queryRunner.dropForeignKey(
      'staff_shift_schedule',
      'FK_Staff_shift_schedule_classification_settings_id'
    );

    // Drop the column
    await queryRunner.dropColumn(
      'staff_shift_schedule',
      'classification_settings_id'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back the column
    await queryRunner.addColumn(
      'staff_shift_schedule',
      new TableColumn({
        name: 'classification_settings_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    // Add back the foreign key
    await queryRunner.createForeignKey(
      'staff_shift_schedule',
      new TableForeignKey({
        columnNames: ['classification_settings_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staffing_classification_setting',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_Staff_shift_schedule_classification_settings_id',
      })
    );
  }
}
