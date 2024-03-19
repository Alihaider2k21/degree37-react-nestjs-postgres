import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftsHistiry1700589796725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts_history',
      'reduction_percentage',
      new TableColumn({
        name: 'reduction_percentage',
        type: 'double precision',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('shifts_history', 'reduction_percentage');
  }
}
