import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableColumn } from 'typeorm';

export class AlterStaffingClassificationSettingTable1700589796726
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      !(await queryRunner.hasColumn(
        'staffing_classification_setting',
        'minimum_hours_per_week'
      ))
    ) {
      await queryRunner.addColumn(
        'staffing_classification_setting',
        new TableColumn({
          name: 'minimum_hours_per_week',
          type: 'int',
          isNullable: true,
        })
      );
    }

    if (
      await queryRunner.hasColumn(
        'staffing_classification_setting',
        'min_hours_per_week'
      )
    ) {
      await queryRunner.dropColumn(
        'staffing_classification_setting',
        'min_hours_per_week'
      );
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    if (
      await queryRunner.hasColumn(
        'staffing_classification_setting',
        'minimum_hours_per_week'
      )
    ) {
      await queryRunner.dropColumn(
        'staffing_classification_setting',
        'minimum_hours_per_week'
      );
    }

    if (
      !(await queryRunner.hasColumn(
        'staffing_classification_setting',
        'min_hours_per_week'
      ))
    ) {
      await queryRunner.addColumn(
        'staffing_classification_setting',
        new TableColumn({
          name: 'min_hours_per_week',
          type: 'int',
          isNullable: true,
        })
      );
    }
  }
}
