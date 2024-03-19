import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
export class AlterUsersHistoryTableAddIsImpersonateUserColumn1701886050956
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_history',
      new TableColumn({
        name: 'is_impersonateable_user',
        type: 'boolean',
        default: false,
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'user_history',
      new TableColumn({
        name: 'is_impersonateable_user',
        type: 'boolean',
        default: false,
      })
    );
  }
}
