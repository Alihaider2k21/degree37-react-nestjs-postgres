import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateMonthlyGoalsCollectionOperationTable1694706497474
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'monthly_goals_collection_operations',
        columns: [
          {
            name: 'monthly_goals_id',
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
      'monthly_goals_collection_operations',
      new TableForeignKey({
        columnNames: ['monthly_goals_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'monthly_goals',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'monthly_goals_collection_operations',
      new TableForeignKey({
        columnNames: ['business_unit_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'monthly_goals_collection_operations',
      new TableIndex({
        columnNames: ['monthly_goals_id'],
      })
    );

    await queryRunner.createIndex(
      'monthly_goals_collection_operations',
      new TableIndex({
        columnNames: ['business_unit_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey(
      'monthly_goals_collection_operations',
      'FK_monthly_goals_id'
    );
    await queryRunner.dropForeignKey(
      'monthly_goals_collection_operations',
      'FK_collection_operation_id'
    );

    // Drop the table
    await queryRunner.dropTable('monthly_goals_collection_operations');
  }
}
