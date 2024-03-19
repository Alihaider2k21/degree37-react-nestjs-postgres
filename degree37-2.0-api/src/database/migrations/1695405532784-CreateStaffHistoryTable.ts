import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatestaffHistoryTable1695405532784
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the staff_history table
    await queryRunner.createTable(
      new Table({
        name: 'staff_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'prefix', type: 'bigint', isNullable: true },
          { name: 'suffix', type: 'bigint', isNullable: true },
          {
            name: 'title',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'birth_date',
            type: 'timestamp',
            precision: 6,
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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
          {
            name: 'collection_operation_id',
            type: 'bigint',
          },
          {
            name: 'classification_id',
            type: 'bigint',
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the staff_history table
    await queryRunner.dropTable('staff_history');
  }
}
