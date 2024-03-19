import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ScheduleOperationStatus1702626177626
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedule_operation_status',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'schedule_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'operation_status_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
        ],
      })
    );
    await queryRunner.createForeignKey(
      'schedule_operation_status',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'schedule_operation_status',
      new TableForeignKey({
        columnNames: ['schedule_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'schedule',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'schedule_operation_status',
      new TableForeignKey({
        columnNames: ['operation_status_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operations_status',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'schedule_operation_status',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'schedule_operation_status',
      'FK_operation_status_id'
    );
    await queryRunner.dropForeignKey(
      'schedule_operation_status',
      'FK_Schedule_id'
    );

    await queryRunner.dropTable('schedule_operation_status');
  }
}
