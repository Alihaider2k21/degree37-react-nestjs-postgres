import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStaffingClassificationSettingHistoryTable1693934256858
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staffing_classification_setting_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'classification_id',
            type: 'bigint',
            isNullable: true,
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
            isNullable: false,
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
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('staffing_classification_setting_history');
  }
}
