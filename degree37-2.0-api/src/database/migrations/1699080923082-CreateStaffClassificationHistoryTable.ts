import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import genericHistoryColumns from '../common/generic-history-columns';

export class CreateStaffClassificationHistoryTable1699080923069
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_classification_history',
        columns: [
          ...genericHistoryColumns,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('staff_classification_history');
  }
}
