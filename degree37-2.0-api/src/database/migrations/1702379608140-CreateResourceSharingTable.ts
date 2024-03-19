import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateResourceSharingTable1702379608140
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'resource_sharings',
        columns: [
          ...genericColumns,
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
            name: 'share_type',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'from_collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'to_collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          { name: 'is_active', type: 'boolean', default: true },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'resource_sharings',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'resource_sharings',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'resource_sharings',
      new TableForeignKey({
        columnNames: ['from_collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'resource_sharings',
      new TableForeignKey({
        columnNames: ['to_collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('resource_sharings', 'created_by');
    await queryRunner.dropForeignKey('resource_sharings', 'tenant_id');
    await queryRunner.dropForeignKey(
      'resource_sharings',
      'from_collection_operation_id'
    );
    await queryRunner.dropForeignKey(
      'resource_sharings',
      'to_collection_operation_id'
    );

    // Then, drop the table
    await queryRunner.dropTable('resource_sharings');
  }
}
