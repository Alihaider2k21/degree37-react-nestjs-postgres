import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDevice1693934201994 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'device',
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
          name: 'device_type_id',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'replace_device',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'retire_on',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'collection_operation',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'status',
          type: 'boolean',
          default: true,
        },
        {
          name: 'is_archived',
          type: 'boolean',
          default: false,
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
        },
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.createForeignKey(
      'device',
      new TableForeignKey({
        columnNames: ['replace_device'],
        referencedColumnNames: ['id'],
        referencedTableName: 'device',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device',
      new TableForeignKey({
        columnNames: ['collection_operation'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device',
      new TableForeignKey({
        columnNames: ['device_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'device_type',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'device',
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
    await queryRunner.dropForeignKey('device', 'FK_replace_device');
    await queryRunner.dropForeignKey('device', 'FK_collection_operation');
    await queryRunner.dropForeignKey('device', 'FK_device_type_id');
    await queryRunner.dropForeignKey('device', 'FK_tenant_id');
    await queryRunner.dropForeignKey('device', 'FK_created_by');
    // Drop foreign key constraints if needed
    await queryRunner.dropTable('device');
  }
}
