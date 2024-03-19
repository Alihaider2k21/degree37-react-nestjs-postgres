import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftsTable1699467276004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts',
      new TableColumn({
        name: 'oef_procedures',
        isNullable: true,
        type: 'number',
      }),
      new TableColumn({
        name: 'oef_procedures',
        isNullable: true,
        type: 'float',
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      new TableColumn({
        name: 'oef_products',
        isNullable: true,
        type: 'number',
      }),
      new TableColumn({
        name: 'oef_products',
        isNullable: true,
        type: 'float',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('shifts', 'oef_procedures');

    await queryRunner.dropColumn('shifts', 'oef_products');
  }
}
