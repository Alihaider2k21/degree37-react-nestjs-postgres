import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProcedureTypesHistory1693934190256
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'procedure_types_history',
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
          name: 'short_description',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'description',
          type: 'text',
          isNullable: false,
        },
        {
          name: 'is_goal_type',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'beds_per_staff',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'procedure_duration',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'is_generate_online_appointments',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'is_active',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'is_archive',
          type: 'boolean',
          default: false,
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
          name: 'created_by',
          type: 'bigint',
          isNullable: true,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the table
    await queryRunner.dropTable('procedure_types_history');
  }
}
