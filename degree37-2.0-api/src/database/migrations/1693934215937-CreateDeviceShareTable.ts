import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDeviceShare1693934215937 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the device_share table
    await queryRunner.createTable(
      new Table({
        name: 'device_share',
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
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'from',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'to',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'share_type',
            type: 'enum',
            enum: ['STAFF', 'VEHICLE', 'DEVICE'],
            default: `'DEVICE'`,
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
      'device_share',
      new TableForeignKey({
        columnNames: ['device'],
        referencedColumnNames: ['id'],
        referencedTableName: 'device',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device_share',
      new TableForeignKey({
        columnNames: ['to'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device_share',
      new TableForeignKey({
        columnNames: ['from'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device_share',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device_share',
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
    await queryRunner.dropForeignKey('device_share', 'FK_device');
    await queryRunner.dropForeignKey('device_share', 'FK_to');
    await queryRunner.dropForeignKey('device_share', 'FK_from');
    await queryRunner.dropForeignKey('device_share', 'FK_created_by');
    await queryRunner.dropForeignKey('device_share', 'FK_tenant_id');
    // Drop the device_share table
    await queryRunner.dropTable('device_share');
  }
}
