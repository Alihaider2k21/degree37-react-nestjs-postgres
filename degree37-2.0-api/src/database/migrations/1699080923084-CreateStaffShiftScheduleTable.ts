import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateStaffShiftScheduleTable1699080923070
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_shift_schedule',

        columns: [
          ...genericColumns,
          {
            name: 'staff_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'classification_settings_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'target_hours_per_week',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'monday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'monday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'tuesday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'tuesday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'wednesday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'wednesday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'thursday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'thursday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'friday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'friday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'saturday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'saturday_end_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'sunday_start_time',
            type: 'time',
            isNullable: false,
          },

          {
            name: 'sunday_end_time',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'staff_shift_schedule',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_Staff_shift_schedule_CreatedBy',
      })
    );

    await queryRunner.createForeignKey(
      'staff_shift_schedule',
      new TableForeignKey({
        columnNames: ['staff_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_Staff_shift_schedule_StaffId',
      })
    );

    await queryRunner.createForeignKey(
      'staff_shift_schedule',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_Staff_shift_schedule_Tenant_Id',
      })
    );

    await queryRunner.createForeignKey(
      'staff_shift_schedule',
      new TableForeignKey({
        columnNames: ['classification_settings_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staffing_classification_setting',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_Staff_shift_schedule_classification_settings_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'staff_shift_schedule',
      'FK_Staff_shift_schedule_CreatedBy'
    );
    await queryRunner.dropForeignKey(
      'staff_shift_schedule',
      'FK_Staff_shift_schedule_StaffId'
    );
    await queryRunner.dropForeignKey(
      'staff_shift_schedule',
      'FK_Staff_shift_schedule_Tenant_Id'
    );
    await queryRunner.dropForeignKey(
      'staff_shift_schedule',
      'FK_Staff_shift_schedule_classification_settings_id'
    );

    await queryRunner.dropTable('staff_shift_schedule');
  }
}
