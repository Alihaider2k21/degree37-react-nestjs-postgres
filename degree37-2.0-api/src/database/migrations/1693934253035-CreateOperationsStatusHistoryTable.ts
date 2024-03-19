import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOperationsStatusHistoryTable1693934253035
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'operations_status_history',
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
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'chip_color',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'applies_to',
            type: 'enum',
            enum: [
              'Drives',
              'Sessions',
              'Accounts',
              'Locations',
              'Donor Centers',
              'Donors',
              'Staff',
              'Volunteers',
            ],
            isArray: true,
            default: `'{Drives}'`,
            isNullable: false,
          },
          {
            name: 'schedulable',
            type: 'boolean',
            default: true,
          },
          {
            name: 'hold_resources',
            type: 'boolean',
            default: true,
          },
          {
            name: 'contribute_to_scheduled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'requires_approval',
            type: 'boolean',
            default: true,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('operations_status_history');
  }
}
