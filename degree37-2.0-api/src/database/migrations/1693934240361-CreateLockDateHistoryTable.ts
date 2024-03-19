import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLockDateHistoryTable1693934240361
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lock_dates_history',
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
            name: 'title',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'collection_operations',
            type: 'bigint',
            isArray: true,
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
            name: 'created_by',
            type: 'bigint',
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
    await queryRunner.dropTable('lock_dates_history');
  }
}
