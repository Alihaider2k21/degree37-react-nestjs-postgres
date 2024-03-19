import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateContactsRolesHistoryTable1693934225541
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contacts_roles_history',
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
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'function_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'average_hourly_rate',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'oef_contribution',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'impacts_oef',
            type: 'boolean',
          },
          {
            name: 'staffable',
            type: 'boolean',
          },
          {
            name: 'status',
            type: 'boolean',
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
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
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
    await queryRunner.dropTable('contacts_roles_history');
  }
}
