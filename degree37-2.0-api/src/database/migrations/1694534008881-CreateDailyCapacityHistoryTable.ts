import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDailyCapacityHistoryTable1694534008881
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'daily_capacity_history',
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
            name: 'mon_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'mon_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tue_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tue_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wed_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wed_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'thur_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'thur_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'fri_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'fri_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sat_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sat_max_staff',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sun_max_drives',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sun_max_staff',
            type: 'int',
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
            isNullable: true,
          },
          {
            name: 'effective_end_date',
            type: 'date',
            isNullable: true,
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
            isNullable: false,
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
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('daily_capacity_history');
  }
}
