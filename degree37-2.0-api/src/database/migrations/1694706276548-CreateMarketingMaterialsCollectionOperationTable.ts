import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateMarketingMaterialsCollectionOperationTable1694706276548
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'marketing_materials_collection_operations',
        columns: [
          {
            name: 'marketing_materials_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'business_unit_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'marketing_materials_collection_operations',
      new TableForeignKey({
        columnNames: ['marketing_materials_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'marketing_materials',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'marketing_materials_collection_operations',
      new TableForeignKey({
        columnNames: ['business_unit_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'marketing_materials_collection_operations',
      new TableIndex({
        columnNames: ['marketing_materials_id'],
      })
    );

    await queryRunner.createIndex(
      'marketing_materials_collection_operations',
      new TableIndex({
        columnNames: ['business_unit_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey(
      'marketing_materials_collection_operations',
      'FK_marketing_materials_id'
    );
    await queryRunner.dropForeignKey(
      'marketing_materials_collection_operations',
      'FK_collection_operation_id'
    );

    // Drop the table
    await queryRunner.dropTable('marketing_materials_collection_operations');
  }
}
