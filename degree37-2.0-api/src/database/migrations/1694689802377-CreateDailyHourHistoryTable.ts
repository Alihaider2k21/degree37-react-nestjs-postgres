import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDailyHourHistoryTable1694689802377
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the daily_hour table
    await queryRunner.createTable(
      new Table({
        name: 'daily_hour_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          {
            name: 'mon_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'mon_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'tue_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'tue_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'wed_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'wed_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'thu_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'thu_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'fri_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'fri_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sat_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sat_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sun_earliest_depart_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sun_latest_return_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'collection_operation',
            type: 'text',
            isArray: true,
            default: `'{}'::text[]`,
          },
          {
            name: 'effective_start_date',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'effective_end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('daily_hour_history');
  }
}
