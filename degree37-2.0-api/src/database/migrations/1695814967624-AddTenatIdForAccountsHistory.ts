import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
export class AddTenatIdForAccountsHistory1695814967624
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'accounts_history',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: true,
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accounts_history', 'tenant_id');
  }
}
