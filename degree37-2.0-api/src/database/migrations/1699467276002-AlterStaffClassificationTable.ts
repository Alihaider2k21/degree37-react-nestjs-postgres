import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterStaffClassificationTable1699467275999
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'staff_classification',
      'FK_StaffClassification_ClassificationSettingsId'
    );

    await queryRunner.dropColumn(
      'staff_classification',
      'classification_settings_id'
    );

    await queryRunner.dropColumn(
      'staff_classification_history',
      'classification_settings_id'
    );

    await queryRunner.addColumn(
      'staff_classification',
      new TableColumn({
        name: 'staffing_classification_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'staff_classification_history',
      new TableColumn({
        name: 'staffing_classification_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.createForeignKey(
      'staff_classification',
      new TableForeignKey({
        columnNames: ['staffing_classification_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staffing_classification',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_Staffing_classification_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'staff_classification',
      new TableColumn({
        name: 'classification_settings_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.createForeignKey(
      'staff_classification',
      new TableForeignKey({
        columnNames: ['classification_settings_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staffing_classification_setting',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_Staff_shift_schedule_classification_settings_id',
      })
    );

    await queryRunner.dropForeignKey(
      'staff_classification',
      'FK_Staffing_classification_id'
    );

    await queryRunner.addColumn(
      'staff_classification',
      new TableColumn({
        name: 'staffing_classification_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'staff_classification',
      new TableColumn({
        name: 'classification_settings_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.dropColumn(
      'staff_classification_history',
      'staffing_classification_id'
    );
  }
}
