import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStaffClassificationTable1699080923068
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_classification',

        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
          {
            name: 'staff_id',
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
            name: 'minimum_hours_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'maximum_hours_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'minimum_days_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'maximum_days_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'maximum_consecutive_days_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'maximum_ot_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'maximum_weekend_hours',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'maximum_consecutive_weekends',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'maximum_weekends_per_month',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'overtime_threshold',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'minimum_recovery_time',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'staff_classification',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_StaffClassification_CreatedBy',
      })
    );

    await queryRunner.createForeignKey(
      'staff_classification',
      new TableForeignKey({
        columnNames: ['staff_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_StaffClassification_StaffId',
      })
    );

    await queryRunner.createForeignKey(
      'staff_classification',
      new TableForeignKey({
        columnNames: ['classification_settings_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staffing_classification_setting',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_StaffClassification_ClassificationSettingsId',
      })
    );

    await queryRunner.createForeignKey(
      'staff_classification',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_StaffClassification_Tenant_Id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'staff_classification',
      'FK_StaffClassification_CreatedBy'
    );
    await queryRunner.dropForeignKey(
      'staff_classification',
      'FK_StaffClassification_StaffId'
    );
    await queryRunner.dropForeignKey(
      'staff_classification',
      'FK_StaffClassification_ClassificationSettingsId'
    );
    await queryRunner.dropForeignKey(
      'staff_classification',
      'FK_StaffClassification_Tenant_Id'
    );

    await queryRunner.dropTable('staff_classification');
  }
}
