import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateGoalVarianceHistoryTable1693934256096
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'goal_variance_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'over_goal',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'under_goal',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'updated_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            precision: 6,
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            precision: 6,
            isNullable: true,
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'is_archive',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'goal_variance_history',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'goal_variance_history',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'goal_variance_history',
      new TableForeignKey({
        columnNames: ['id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'goal_variance',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('goal_variance_history', 'FK_created_by');
    await queryRunner.dropForeignKey('goal_variance_history', 'FK_updated_by');
    await queryRunner.dropForeignKey('goal_variance_history', 'FK_id');
    // Then drop the table
    await queryRunner.dropTable('goal_variance_history');
  }
}
