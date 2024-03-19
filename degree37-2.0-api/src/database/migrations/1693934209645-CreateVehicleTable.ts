import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVehicle1693934209645 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the vehicles table
    await queryRunner.createTable(
      new Table({
        name: 'vehicle',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
            type: 'date',
            isNullable: true,
          },
          {
            name: 'collection_operation',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );

    await queryRunner.createForeignKey(
      'vehicle',
      new TableForeignKey({
        columnNames: ['collection_operation'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle',
      new TableForeignKey({
        columnNames: ['vehicle_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicle_type',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle',
      new TableForeignKey({
        columnNames: ['replace_vehicle_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicle',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle',
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
    await queryRunner.dropForeignKey('vehicle', 'FK_collection_operation');
    await queryRunner.dropForeignKey('vehicle', 'FK_vehicle_type_id');
    await queryRunner.dropForeignKey('vehicle', 'FK_replace_vehicle_id');
    await queryRunner.dropForeignKey('vehicle', 'FK_created_by');
    await queryRunner.dropForeignKey('vehicle', 'FK_tenant_id');
    // Drop the vehicles table
    await queryRunner.dropTable('vehicle');
  }
}
