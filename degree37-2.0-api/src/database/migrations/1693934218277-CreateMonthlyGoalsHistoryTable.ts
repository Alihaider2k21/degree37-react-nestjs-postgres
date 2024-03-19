import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMonthlyGoalsHistory1693934218277
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the monthly_goals_history table
    await queryRunner.createTable(
      new Table({
        name: 'monthly_goals_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          {
            name: 'id',
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
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'january',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'february',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'march',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'april',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'may',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'june',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'july',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'august',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'september',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'october',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'november',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'december',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'total_goal',
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: 'procedure_type',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'collection_operation',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'donor_center',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'recruiter',
            type: 'bigint',
            isNullable: true,
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
    // Drop the monthly_goals_history table
    await queryRunner.dropTable('monthly_goals_history');
  }
}
