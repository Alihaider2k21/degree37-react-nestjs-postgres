import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStaffingClassificationSettingTable1693934250704
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staffing_classification_setting',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'classification_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'minimum_hours_per_week',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'target_hours_per_week',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'max_consec_days_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'min_days_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'max_days_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'max_hours_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'max_weekend_hours',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'min_recovery_time',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'max_consec_weekends',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'max_ot_per_week',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'max_weekends_per_months',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'overtime_threshold',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
            isNullable: true,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'staffing_classification_setting',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staffing_classification_setting',
      new TableForeignKey({
        columnNames: ['classification_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staffing_classification',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staffing_classification_setting',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'staffing_classification_setting',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'staffing_classification_setting',
      'FK_classification_id'
    );
    await queryRunner.dropForeignKey(
      'staffing_classification_setting',
      'FK_tenant_id'
    );

    await queryRunner.dropTable('staffing_classification_setting');
  }
}
