import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftHistoryTable1700488768791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts_history',
      'oef_procedures',
      new TableColumn({
        name: 'oef_procedures',
        type: 'double precision',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'shifts_history',
      'oef_products',
      new TableColumn({
        name: 'oef_products',
        type: 'double precision',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts_history',
      'oef_procedures',
      new TableColumn({
        name: 'oef_procedures',
        type: 'int',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'shifts_history',
      'oef_products',
      new TableColumn({
        name: 'oef_products',
        type: 'int',
        isNullable: false,
      })
    );
  }
}
