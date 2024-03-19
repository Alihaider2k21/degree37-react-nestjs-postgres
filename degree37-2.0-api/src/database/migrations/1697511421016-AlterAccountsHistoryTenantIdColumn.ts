import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAccountsHistoryTenantIdColumn1697511421016
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'accounts_history',
      'tenant_id',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'accounts_history',
      'tenant_id',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: true,
      })
    );
  }
}
