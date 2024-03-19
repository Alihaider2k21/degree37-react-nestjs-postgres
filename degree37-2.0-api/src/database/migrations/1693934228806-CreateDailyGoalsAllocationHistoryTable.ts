import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDailyGoalsAllocationHistoryTable1693934228806
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'daily_goals_allocation_history',
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
            name: 'procedure_type_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'effective_date',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'sunday',
            type: 'float',
          },
          {
            name: 'monday',
            type: 'float',
          },
          {
            name: 'tuesday',
            type: 'float',
          },
          {
            name: 'wednesday',
            type: 'float',
          },
          {
            name: 'thursday',
            type: 'float',
          },
          {
            name: 'friday',
            type: 'float',
          },
          {
            name: 'saturday',
            type: 'float',
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
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
            name: 'created_by',
            type: 'bigint',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the 'daily_goals_allocation_history' table
    await queryRunner.dropTable('daily_goals_allocation_history');
  }
}
