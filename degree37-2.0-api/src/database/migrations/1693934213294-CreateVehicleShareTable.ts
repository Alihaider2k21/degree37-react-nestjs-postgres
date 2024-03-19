import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVehicleShare1693934213294 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the vehicle_share table
    await queryRunner.createTable(
      new Table({
        name: 'vehicle_share',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'vehicle_id',
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
            default: `'VEHICLE'`,
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
      'vehicle_share',
      new TableForeignKey({
        columnNames: ['vehicle_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicle',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle_share',
      new TableForeignKey({
        columnNames: ['to'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle_share',
      new TableForeignKey({
        columnNames: ['from'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle_share',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle_share',
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
    await queryRunner.dropForeignKey('vehicle_share', 'FK_vehicle_id');
    await queryRunner.dropForeignKey('vehicle_share', 'FK_to');
    await queryRunner.dropForeignKey('vehicle_share', 'FK_from');
    await queryRunner.dropForeignKey('vehicle_share', 'FK_created_by');
    await queryRunner.dropForeignKey('vehicle_share', 'FK_tenant_id');
    // Drop the vehicle_share table
    await queryRunner.dropTable('vehicle_share');
  }
}
