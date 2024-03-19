import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTenantConfigurationDetailHistory1693934187096
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'tenant_configuration_detail_history',
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
          name: 'history_reason',
          type: 'varchar',
          length: '1',
        },
        {
          name: 'element_name',
          type: 'varchar',
          length: '60',
          isNullable: false,
        },
        {
          name: 'end_point_url',
          type: 'text',
          isNullable: false,
        },
        {
          name: 'secret_key',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'secret_value',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          precision: 6,
          default: `('now'::text)::timestamp(6) with time zone`,
        },
        {
          name: 'tenant_id',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'created_by',
          type: 'bigint',
          isNullable: false,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the table
    await queryRunner.dropTable('tenant_configuration_detail_history');
  }
}
