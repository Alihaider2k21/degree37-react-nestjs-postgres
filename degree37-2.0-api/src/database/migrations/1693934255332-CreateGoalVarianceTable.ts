import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateGoalVarianceTable1693934255332
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'goal_variance',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
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
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'goal_variance',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'goal_variance',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'goal_variance',
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
    await queryRunner.dropForeignKey('goal_variance', 'FK_created_by');
    await queryRunner.dropForeignKey('goal_variance', 'FK_updated_by');
    await queryRunner.dropForeignKey('goal_variance', 'FK_tenant_id');
    // Then drop the table
    await queryRunner.dropTable('goal_variance');
  }
}
