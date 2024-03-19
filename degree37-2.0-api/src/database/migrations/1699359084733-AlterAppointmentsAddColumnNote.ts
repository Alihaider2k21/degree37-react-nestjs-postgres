import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAppointmentsAddColumnNote1699359084733
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'donors_appointments',
      new TableColumn({
        name: 'note',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'note');
  }
}
