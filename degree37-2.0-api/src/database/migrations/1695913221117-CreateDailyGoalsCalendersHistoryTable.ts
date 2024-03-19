import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDailyGoalsCalendersHistoryTable1695913221117
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'daily_goals_calenders_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'history_reason', type: 'varchar', length: '1' },
          {
            name: 'date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'procedure_type_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'goal_amount',
            type: 'float',
          },
          {
            name: 'collection_operation',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
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
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          { name: 'is_locked', type: 'boolean', default: false },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the 'daily_goals_calenders' table
    await queryRunner.dropTable('daily_goals_calenders_history');
  }
}
