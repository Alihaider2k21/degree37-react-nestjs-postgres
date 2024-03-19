import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVehicleTypeHistory1693934199679
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'vehicle_type_history',
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
          name: 'description',
          type: 'text',
          isNullable: false,
        },
        {
          name: 'location_type_id',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'linkable',
          type: 'boolean',
          default: true,
          isNullable: false,
        },
        {
          name: 'is_active',
          type: 'boolean',
          default: false,
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
          name: 'created_by',
          type: 'bigint',
          isNullable: false,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vehicle_type_history');
  }
}
