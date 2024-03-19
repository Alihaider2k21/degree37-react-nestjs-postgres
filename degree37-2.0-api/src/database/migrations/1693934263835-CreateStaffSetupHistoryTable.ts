import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStaffSetupHistoryTable1693934263835
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_setup_history',
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
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'short_name',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'beds',
            type: 'int',
            default: 1,
          },
          {
            name: 'concurrent_beds',
            type: 'int',
            default: 1,
          },
          {
            name: 'stagger_slots',
            type: 'int',
            default: 1,
          },
          {
            name: 'opeartion_type_id',
            type: 'varchar',
          },
          {
            name: 'location_type_id',
            type: 'varchar',
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
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('staff_setup_history');
  }
}
