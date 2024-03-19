import { StaffScheduleStatusEnum } from '../../api/crm/contacts/staff/staffSchedule/enum/staff-schedule.enum';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStaffAssignmentsTable1699467275822
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_assignments',
        columns: [
          { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true },
          { name: 'staff_id', type: 'bigint', isNullable: false },
          { name: 'role_id', type: 'bigint', isNullable: false },
          { name: 'tenant_id', type: 'bigint', isNullable: false },
          { name: 'shift_id', type: 'bigint', isNullable: false },
          { name: 'operation_id', type: 'bigint', isNullable: false },
          {
            name: 'operation_type',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          { name: 'is_additional', type: 'boolean', isNullable: false },
          { name: 'home_base', type: 'int', isNullable: false },
          {
            name: 'is_travel_time_included',
            type: 'boolean',
            isNullable: true,
          },
          { name: 'lead_time', type: 'int', isNullable: false },
          { name: 'travel_to_time', type: 'int', isNullable: false },
          { name: 'setup_time', type: 'int', isNullable: false },
          { name: 'pending_assignment', type: 'boolean', isNullable: false },
          { name: 'breakdown_time', type: 'int', isNullable: false },
          { name: 'travel_from_time', type: 'int', isNullable: false },
          { name: 'wrapup_time', type: 'int', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: Object.keys(StaffScheduleStatusEnum),
            isNullable: true,
          },
          {
            name: 'clock_in_time',
            type: 'timestamp',
            precision: 6,
            isNullable: false,
          },
          {
            name: 'clock_out_time',
            type: 'timestamp',
            precision: 6,
            isNullable: false,
          },
          { name: 'total_hours', type: 'int', isNullable: false },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );
    new TableForeignKey({
      columnNames: ['staff_id'],
      referencedTableName: 'staff',
      referencedColumnNames: ['id'],
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
      name: 'FK_assignment_staff_id',
    }),
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedTableName: 'contacts_roles',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_assignment_role_id',
      }),
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedTableName: 'tenant',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_assignment_tenant_id',
      }),
      new TableForeignKey({
        columnNames: ['shift_id'],
        referencedTableName: 'shifts_slots',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_assignment_shift_id',
      });
    new TableForeignKey({
      columnNames: ['created_by'],
      referencedTableName: 'user',
      referencedColumnNames: ['id'],
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
      name: 'FK_assignment_user_id',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'staff_assignments',
      'FK_assignment_role_id'
    );
    await queryRunner.dropForeignKey(
      'staff_assignments',
      'FK_assignment_staff_id'
    );
    await queryRunner.dropForeignKey(
      'staff_assignments',
      'FK_assignment_tenant_id'
    );
    await queryRunner.dropForeignKey(
      'staff_assignments',
      'FK_assignment_shift_id'
    );
    await queryRunner.dropForeignKey(
      'staff_assignments',
      'FK_assignment_user_id'
    );
    await queryRunner.dropTable('staff_assignments');
  }
}
