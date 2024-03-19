import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBusinessUnitsHistoryTable1694530641287
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the business_units_history table
    await queryRunner.createTable(
      new Table({
        name: 'business_units_history',
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
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'organizational_level_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'parent_level',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
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
      }),
      true // set `true` to create the table if it doesn't exist
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the business_units_history table
    await queryRunner.dropTable('business_units_history');
  }
}
