import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBannerCollectionOperationTable1694697835475
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'banner_collection_operations',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
            name: 'banner_id',
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

    // Define foreign key constraints
    await queryRunner.createForeignKey(
      'banner_collection_operations',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'banner_collection_operations',
      new TableForeignKey({
        columnNames: ['banner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'banners',
        onDelete: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'banner_collection_operations',
      new TableForeignKey({
        columnNames: ['collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey(
      'banner_collection_operations',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'banner_collection_operations',
      'FK_banner_id'
    );
    await queryRunner.dropForeignKey(
      'banner_collection_operations',
      'FK_collection_operation_id'
    );

    // Drop the table
    await queryRunner.dropTable('banner_collection_operations');
  }
}
