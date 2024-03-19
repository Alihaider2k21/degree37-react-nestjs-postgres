import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export enum StaffLeaveType {
  SICK = 'SICK',
  CASUAL = 'CASUAL',
}

export class StaffLeaveHistoryTable1694699768932 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create table
    await queryRunner.createTable(
      new Table({
        name: 'staff_leave_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          {
            name: 'staff_id',
            type: 'bigint',
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(StaffLeaveType),
            isNullable: false,
          },
          {
            name: 'begin_date',
            type: 'date',
          },
          {
            name: 'end_date',
            type: 'date',
          },
          {
            name: 'hours',
            type: 'int4',
          },
          {
            name: 'note',
            type: 'text',
          },
          { name: 'is_archived', type: 'boolean', default: false },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      }),
      true // set `true` to create the table if it doesn't exist);
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('staff_leave_history');
  }
}
