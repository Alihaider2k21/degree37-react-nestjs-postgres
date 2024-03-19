import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateNcpCollectionOperationsTable1702200497332
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ncp_collection_operations',
        columns: [
          {
            name: 'ncp_id',
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
      'ncp_collection_operations',
      new TableForeignKey({
        columnNames: ['ncp_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_non_collection_profiles',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'ncp_collection_operations',
      new TableForeignKey({
        columnNames: ['business_unit_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'ncp_collection_operations',
      new TableIndex({
        columnNames: ['ncp_id'],
      })
    );

    await queryRunner.createIndex(
      'ncp_collection_operations',
      new TableIndex({
        columnNames: ['business_unit_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey('ncp_collection_operations', 'FK_ncp_id');
    await queryRunner.dropForeignKey(
      'ncp_collection_operations',
      'FK_business_unit_id'
    );

    // Drop the table
    await queryRunner.dropTable('ncp_collection_operations');
  }
}
