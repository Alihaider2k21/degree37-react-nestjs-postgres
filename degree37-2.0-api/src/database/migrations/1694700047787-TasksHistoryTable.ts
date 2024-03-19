import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TasksHistoryTable1694700047787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the tasks table
    await queryRunner.createTable(
      new Table({
        name: 'tasks_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'taskable_id', type: 'bigint', isNullable: true },
          {
            name: 'taskable_type',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          { name: 'assigned_to', type: 'bigint', isNullable: false },
          { name: 'assigned_by', type: 'bigint', isNullable: false },
          {
            name: 'task_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'due_date', type: 'date', isNullable: true },
          { name: 'status', type: 'int', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the tasks table
    await queryRunner.dropTable('tasks_history');
  }
}
