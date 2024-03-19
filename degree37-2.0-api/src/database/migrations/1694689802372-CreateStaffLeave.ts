import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import GenericColumns from '../common/generic-columns';

export enum StaffLeaveType {
  SICK = 'SICK',
  CASUAL = 'CASUAL',
}

export class CreateStaffLeave1694689802372 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create table
    await queryRunner.createTable(
      new Table({
        name: 'staff_leave',
        columns: [
          ...GenericColumns,
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
        ],
      }),
      true // set `true` to create the table if it doesn't exist);
    );

    await queryRunner.createForeignKey(
      'staff_leave',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_leave',
      new TableForeignKey({
        columnNames: ['staff_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_leave',
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
    await queryRunner.dropForeignKey('staff_leave', 'FK_created_by');
    await queryRunner.dropForeignKey('staff_leave', 'FK_staff_id');
    await queryRunner.dropForeignKey('staff_leave', 'FK_tenant_id');

    await queryRunner.dropTable('staff_leave');
  }
}
