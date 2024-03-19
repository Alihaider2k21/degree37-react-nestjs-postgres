import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDeviceHistory1693934202786 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'device_history',
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
          length: '60',
          isNullable: false,
        },
        {
          name: 'short_name',
          type: 'varchar',
          length: '20',
          isNullable: false,
        },
        {
          name: 'description',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'device_type',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'replace_device',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'retire_on',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'collection_operation',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'is_archived',
          type: 'boolean',
          default: false,
        },
        {
          name: 'status',
          type: 'boolean',
          default: true,
        },
        {
          name: 'created_by',
          type: 'bigint',
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
          default: 'now()',
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('device_history');
  }
}
