import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDeviceTypeHistory1693934206600
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the device_type_history table
    await queryRunner.createTable(
      new Table({
        name: 'device_type_history',
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
            isNullable: false,
          },
          {
            name: 'id',
            type: 'integer',
          },
          {
            name: 'procedure_type_id',
            type: 'integer',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'boolean',
            default: true,
          },
          {
            name: 'is_archive',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'integer',
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the device_type_history table
    await queryRunner.dropTable('device_type_history');
  }
}
