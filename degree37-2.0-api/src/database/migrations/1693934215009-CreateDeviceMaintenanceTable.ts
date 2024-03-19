import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDeviceMaintenance1693934215009
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the device_maintenance table
    await queryRunner.createTable(
      new Table({
        name: 'device_maintenance',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'device',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'start_date_time',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'end_date_time',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'reduce_slots',
            type: 'boolean',
            default: true,
            isNullable: false,
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

    await queryRunner.createForeignKey(
      'device_maintenance',
      new TableForeignKey({
        columnNames: ['device'],
        referencedColumnNames: ['id'],
        referencedTableName: 'device',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device_maintenance',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device_maintenance',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('device_maintenance', 'FK_device');
    await queryRunner.dropForeignKey('device_maintenance', 'FK_created_by');
    await queryRunner.dropForeignKey('device_maintenance', 'FK_tenant_id');
    // Drop the device_maintenance table
    await queryRunner.dropTable('device_maintenance');
  }
}
