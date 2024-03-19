import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDrivesTableAddOEFColumns1698765675949
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('drives', [
      new TableColumn({
        name: 'oef_products',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
      new TableColumn({
        name: 'oef_procedures',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('drives', [
      new TableColumn({
        name: 'oef_products',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
      new TableColumn({
        name: 'oef_procedures',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    ]);
  }
}
