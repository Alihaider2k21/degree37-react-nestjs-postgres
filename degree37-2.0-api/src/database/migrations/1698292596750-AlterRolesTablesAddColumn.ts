import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterRolesTablesAddColumn1698292596750
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'roles',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('roles', 'tenant_id');
  }
}
