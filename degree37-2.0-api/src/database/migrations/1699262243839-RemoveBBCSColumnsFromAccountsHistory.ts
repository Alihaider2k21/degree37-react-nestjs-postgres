import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveBBCSColumnsFromAccountsHistory1699262243839
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accounts_history', 'account_id');
    await queryRunner.dropColumn('accounts_history', 'external_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('accounts_history', [
      new TableColumn({
        name: 'account_id',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'external_id',
        type: 'varchar',
        length: '36',
        isNullable: true,
      }),
    ]);
  }
}
