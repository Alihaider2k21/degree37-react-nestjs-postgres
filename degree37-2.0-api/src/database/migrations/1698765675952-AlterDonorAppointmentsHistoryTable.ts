import { DonorAppointmentsEnum } from '../../api/crm/contacts/donor/enum/donors.enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDonorAppointmentsHistoryTable1698765675952
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'donors_appointments_history',
      new TableColumn({
        name: 'appointmentable_type',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'appointmentable_type',
        type: 'enum',
        enum: Object.values(DonorAppointmentsEnum),
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'donors_appointments_history',
      new TableColumn({
        name: 'appointmentable_type',
        type: 'enum',
        enum: Object.values(DonorAppointmentsEnum),
        isNullable: true,
      }),
      new TableColumn({
        name: 'appointmentable_type',
        type: 'bigint',
        isNullable: false,
      })
    );
  }
}
