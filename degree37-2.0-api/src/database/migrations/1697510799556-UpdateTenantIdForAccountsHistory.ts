import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTenantIdForAccountsHistory1697510799556
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tenant = await queryRunner.query('SELECT * from tenant LIMIT 1');
    if (tenant.legnth)
      await queryRunner.query(
        `UPDATE accounts_history SET tenant_id = ${tenant[0].id}`
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('UPDATE accounts_history SET tenant_id = null');
  }
}