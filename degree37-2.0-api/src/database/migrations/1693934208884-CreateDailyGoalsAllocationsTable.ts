import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDailyGoalsAllocations1693934208884
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the daily_goals_allocations table
    await queryRunner.createTable(
      new Table({
        name: 'daily_goals_allocations',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'effective_date',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
            isNullable: false,
          },
          {
            name: 'sunday',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'monday',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'tuesday',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'wednesday',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'thursday',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'friday',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'saturday',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'procedure_type_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
            isNullable: false,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );

    await queryRunner.createForeignKey(
      'daily_goals_allocations',
      new TableForeignKey({
        columnNames: ['procedure_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure_types',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'daily_goals_allocations',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'daily_goals_allocations',
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
    await queryRunner.dropForeignKey(
      'daily_goals_allocations',
      'FK_procedure_type_id'
    );
    await queryRunner.dropForeignKey('daily_goals_allocations', 'FK_tenant_id');
    await queryRunner.dropForeignKey(
      'daily_goals_allocations',
      'FK_created_by'
    );
    // Drop the daily_goals_allocations table
    await queryRunner.dropTable('daily_goals_allocations');
  }
}
