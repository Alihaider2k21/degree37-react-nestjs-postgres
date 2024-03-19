import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
export class AlterUsersTableAddIsImpersonateUserColumn1701886050954
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'is_impersonateable_user',
        type: 'boolean',
        default: false,
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'user',
      new TableColumn({
        name: 'is_impersonateable_user',
        type: 'boolean',
        default: false,
      })
    );
  }
}
