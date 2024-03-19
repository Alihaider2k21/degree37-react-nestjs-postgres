import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAllowDonorMinimumAgeColumnInTenantHistoryTable1698410084040
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('tenant_history', [
      new TableColumn({
        name: 'allow_donor_minimum_age',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tenant_history', 'allow_donor_minimum_age');
  }
}
