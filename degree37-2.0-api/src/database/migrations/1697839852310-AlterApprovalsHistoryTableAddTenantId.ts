import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterApprovalsHistoryTableAddTenantId1697839852310
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'aprovals_history',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('aprovals_history', 'tenant_id');
  }
}
