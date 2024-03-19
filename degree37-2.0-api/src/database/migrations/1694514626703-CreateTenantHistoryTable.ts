import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTenantHistoryTable1694514626703
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tenant_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'tenant_name', type: 'varchar', length: '255' },
          { name: 'history_reason', type: 'varchar', length: '1' },
          { name: 'allow_email', type: 'boolean', default: false },
          { name: 'tenant_domain', type: 'varchar', length: '255' },
          { name: 'admin_domain', type: 'varchar', length: '255' },
          { name: 'email', type: 'varchar', length: '255' },
          { name: 'tenant_code', type: 'varchar', length: '60' },
          { name: 'phone_number', type: 'varchar', length: '20' },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
          },
          { name: 'is_active', type: 'boolean', default: false },
          { name: 'password', type: 'varchar', length: '60' },
          { name: 'tenant_timezone', type: 'varchar', length: '5' },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tenant_history');
  }
}
