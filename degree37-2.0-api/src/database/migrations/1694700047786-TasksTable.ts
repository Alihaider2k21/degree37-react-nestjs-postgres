import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TasksTable1694700047786 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the tasks table
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
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
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );

    // Create foreign key constraint for tenant_id
    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['assigned_to'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['assigned_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tasks', 'FK_assigned_to');
    await queryRunner.dropForeignKey('tasks', 'FK_assigned_by');
    await queryRunner.dropForeignKey('tasks', 'FK_tenant_id');
    await queryRunner.dropForeignKey('tasks', 'FK_created_by');
    // Drop the tasks table
    await queryRunner.dropTable('tasks');
  }
}
