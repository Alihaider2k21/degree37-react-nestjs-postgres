import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAccountsTenantIdColumn1697511419377
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'accounts',
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
      'accounts',
      'tenant_id',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: true,
      })
    );
  }
}
