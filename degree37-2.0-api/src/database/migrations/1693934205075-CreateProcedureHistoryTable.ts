import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProcedureHistory1693934205075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the procedure_history table
    await queryRunner.createTable(
      new Table({
        name: 'procedure_history',
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
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'procedure_type_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'external_reference',
            type: 'varchar',
            length: '255',
            isNullable: true,
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
            name: 'is_archive',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: true,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the procedure_history table
    await queryRunner.dropTable('procedure_history');
  }
}
