import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftsHistoryTable1700028883615
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts_history',
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
      'shifts_history',
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
    await queryRunner.dropColumn('shifts_history', 'oef_procedures');
    await queryRunner.dropColumn('shifts_history', 'oef_products');
  }
}
