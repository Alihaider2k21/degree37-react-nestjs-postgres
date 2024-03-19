import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
export class AlterRolesTableAddIsImpersonateRoleAndIsAutoCreatedColumn1701886050955
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'roles',
      new TableColumn({
        name: 'is_impersonateable_role',
        type: 'boolean',
        default: false,
      })
    );
    await queryRunner.addColumn(
      'roles',
      new TableColumn({
        name: 'is_autocreated',
        type: 'boolean',
        default: false,
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'roles',
      new TableColumn({
        name: 'is_impersonateable_role',
        type: 'boolean',
        default: false,
      })
    );
    await queryRunner.dropColumn(
      'roles',
      new TableColumn({
        name: 'is_autocreated',
        type: 'boolean',
        default: false,
      })
    );
  }
}
