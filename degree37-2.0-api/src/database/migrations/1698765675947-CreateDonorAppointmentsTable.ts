import { AppointmentStatusTypeEnum } from '../../api/crm/contacts/common/enums';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDonorAppointmentsTable1698765675947
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donors_appointments',
        columns: [
          { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true },
          {
            name: 'appointmentable_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'appointmentable_type',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'donor_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'slot_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'procedure_type_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(AppointmentStatusTypeEnum),
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
            default: 'now()',
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );
    await queryRunner.createForeignKey(
      'donors_appointments',
      new TableForeignKey({
        columnNames: ['donor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'donor',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_appointment_donor_id',
      })
    );
    await queryRunner.createForeignKey(
      'donors_appointments',
      new TableForeignKey({
        columnNames: ['slot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shifts_slots',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_appointment_shifts_slots_id',
      })
    );
    await queryRunner.createForeignKey(
      'donors_appointments',
      new TableForeignKey({
        columnNames: ['procedure_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure_types',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_appointment_procedure_type_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'donors_appointments',
      'FK_appointment_donor_id'
    );
    await queryRunner.dropForeignKey(
      'donors_appointments',
      'FK_appointment_shifts_slots_id'
    );
    await queryRunner.dropForeignKey(
      'donors_appointments',
      'FK_appointment_procedure_type_id'
    );
    await queryRunner.dropTable('donors_appointments');
  }
}
