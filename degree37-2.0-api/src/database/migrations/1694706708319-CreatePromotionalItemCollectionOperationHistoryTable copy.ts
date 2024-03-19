import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePromotionalItemCollectionOperationTable1694706708319
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'promotionalItem_collection_operations_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
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
            name: 'promotional_item_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'promotionalItem_collection_operations_history',
      new TableForeignKey({
        columnNames: ['collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'promotionalItem_collection_operations_history',
      new TableForeignKey({
        columnNames: ['promotional_item_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'promotional_items',
        onDelete: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey(
      'promotionalItem_collection_operations_history',
      'FK_collection_operation_id'
    );
    await queryRunner.dropForeignKey(
      'promotionalItem_collection_operations_history',
      'FK_promotional_item_id'
    );
    // Drop the table
    await queryRunner.dropTable(
      'promotionalItem_collection_operations_history'
    );
  }
}
