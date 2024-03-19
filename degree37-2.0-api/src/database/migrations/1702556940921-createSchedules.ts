import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createSchedule1702556940921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedule',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_flagged',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_locked',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_paused',
            type: 'boolean',
            default: false,
          },
          {
            name: 'schedule_status',
            type: 'enum',
            enum: ['Draft', 'Published'],
          },
          {
            name: 'operation_status',
            type: 'bigint',
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
      'schedule',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'schedule',
      new TableForeignKey({
        columnNames: ['collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'schedule',
      new TableForeignKey({
        columnNames: ['operation_status'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operations_status',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('schedule', 'FK_created_by');
    await queryRunner.dropForeignKey('schedule', 'FK_collection_operation_id');
    await queryRunner.dropForeignKey('schedule', 'FK_operation_status');

    await queryRunner.dropTable('schedule');
  }
}
