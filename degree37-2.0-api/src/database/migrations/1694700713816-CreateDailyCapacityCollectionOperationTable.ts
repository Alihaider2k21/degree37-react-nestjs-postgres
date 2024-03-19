import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateDailyCapacityCollectionOperationTable1694700713816
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'daily_capacity_collection_operations',
        columns: [
          {
            name: 'daily_capacity_id',
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

    // Define foreign key constraints

    await queryRunner.createForeignKey(
      'daily_capacity_collection_operations',
      new TableForeignKey({
        columnNames: ['daily_capacity_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'daily_capacity',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'daily_capacity_collection_operations',
      new TableForeignKey({
        columnNames: ['business_unit_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'daily_capacity_collection_operations',
      new TableIndex({
        columnNames: ['daily_capacity_id'],
      })
    );

    await queryRunner.createIndex(
      'daily_capacity_collection_operations',
      new TableIndex({
        columnNames: ['business_unit_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey(
      'daily_capacity_collection_operations',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'daily_capacity_collection_operations',
      'FK_daily_capacity_id'
    );
    await queryRunner.dropForeignKey(
      'daily_capacity_collection_operations',
      'FK_collection_operation_id'
    );

    // Drop the table
    await queryRunner.dropTable('daily_capacity_collection_operations');
  }
}
