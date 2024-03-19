import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAccountsTableBBCSColumns1698154786983
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('accounts', [
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accounts', 'account_id ');
    await queryRunner.dropColumn('accounts', 'external_id ');
  }
}
