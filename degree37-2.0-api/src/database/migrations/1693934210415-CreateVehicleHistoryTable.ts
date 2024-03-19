import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVehicleHistory1693934210415 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the vehicle_history table
    await queryRunner.createTable(
      new Table({
        name: 'vehicle_history',
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
            name: 'vehicle_type_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'replace_vehicle_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'retire_on',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_by',
            type: 'bigint',
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
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the vehicle_history table
    await queryRunner.dropTable('vehicle_history');
  }
}
