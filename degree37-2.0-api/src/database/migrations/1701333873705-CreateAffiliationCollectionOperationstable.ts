import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateAffiliationCollectionOperationstable1701333873705
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'affiliation_collection_operations',
        columns: [
          {
            name: 'affiliation_id',
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
      'affiliation_collection_operations',
      new TableForeignKey({
        columnNames: ['affiliation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'affiliation',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'affiliation_collection_operations',
      new TableForeignKey({
        columnNames: ['business_unit_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'affiliation_collection_operations',
      new TableIndex({
        columnNames: ['affiliation_id'],
      })
    );

    await queryRunner.createIndex(
      'affiliation_collection_operations',
      new TableIndex({
        columnNames: ['business_unit_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey(
      'affiliation_collection_operations',
      'FK_affiliation_id'
    );
    await queryRunner.dropForeignKey(
      'affiliation_collection_operations',
      'FK_collection_operation_id'
    );

    // Drop the table
    await queryRunner.dropTable('affiliation_collection_operations');
  }
}
