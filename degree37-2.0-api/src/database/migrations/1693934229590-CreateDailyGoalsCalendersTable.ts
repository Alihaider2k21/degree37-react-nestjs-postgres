import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDailyGoalsCalendersTable1693934229590
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'daily_goals_calenders',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'procedure_type_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'goal_amount',
            type: 'float',
          },
          {
            name: 'collection_operation',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
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
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'daily_goals_calenders',
      new TableForeignKey({
        columnNames: ['collection_operation'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'daily_goals_calenders',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'daily_goals_calenders',
      new TableForeignKey({
        columnNames: ['procedure_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure_types',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'daily_goals_calenders',
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
    // Drop the foreign key constraints first
    await queryRunner.dropForeignKey(
      'daily_goals_calenders',
      'FK_procedure_type_id'
    );
    await queryRunner.dropForeignKey(
      'daily_goals_calenders',
      'FK_collection_operation_id'
    );
    await queryRunner.dropForeignKey('daily_goals_calenders', 'FK_created_by');
    await queryRunner.dropForeignKey('daily_goals_calenders', 'FK_tenant_id');

    // Drop the 'daily_goals_calenders' table
    await queryRunner.dropTable('daily_goals_calenders');
  }
}
