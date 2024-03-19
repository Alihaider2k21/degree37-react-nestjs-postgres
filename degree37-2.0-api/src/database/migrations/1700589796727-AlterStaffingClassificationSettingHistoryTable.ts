import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableColumn } from 'typeorm';

export class AlterStaffingClassificationSettingHistoryTable1700589796727
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      !(await queryRunner.hasColumn(
        'staffing_classification_setting_history',
        'minimum_hours_per_week'
      ))
    ) {
      await queryRunner.addColumn(
        'staffing_classification_setting_history',
        new TableColumn({
          name: 'minimum_hours_per_week',
          type: 'int',
          isNullable: true,
        })
      );
    }

    if (
      await queryRunner.hasColumn(
        'staffing_classification_setting_history',
        'min_hours_per_week'
      )
    ) {
      await queryRunner.dropColumn(
        'staffing_classification_setting_history',
        'min_hours_per_week'
      );
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    if (
      await queryRunner.hasColumn(
        'staffing_classification_setting_history',
        'minimum_hours_per_week'
      )
    ) {
      await queryRunner.dropColumn(
        'staffing_classification_setting_history',
        'minimum_hours_per_week'
      );
    }

    if (
      !(await queryRunner.hasColumn(
        'staffing_classification_setting_history',
        'min_hours_per_week'
      ))
    ) {
      await queryRunner.addColumn(
        'staffing_classification_setting_history',
        new TableColumn({
          name: 'min_hours_per_week',
          type: 'int',
          isNullable: true,
        })
      );
    }
  }
}
