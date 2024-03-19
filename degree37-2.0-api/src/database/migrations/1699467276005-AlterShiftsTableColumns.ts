import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftsTableColumns1699467276005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts',
      new TableColumn({
        name: 'reduction_percentage',
        isNullable: true,
        type: 'number',
      }),
      new TableColumn({
        name: 'reduction_percentage',
        isNullable: true,
        type: 'float',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('shifts', 'reduction_percentage');
  }
}
