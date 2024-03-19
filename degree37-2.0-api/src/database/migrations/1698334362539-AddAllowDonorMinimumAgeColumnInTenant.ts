import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAllowDonorMinimumAgeColumnInTenant1698334362539
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('tenant', [
      new TableColumn({
        name: 'allow_donor_minimum_age',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tenant', 'allow_donor_minimum_age');
  }
}
