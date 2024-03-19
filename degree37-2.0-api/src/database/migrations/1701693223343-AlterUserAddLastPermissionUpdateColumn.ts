import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserAddLastPermissionUpdateColumn1701693223343
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "last_permissions_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "last_permissions_updated"`
    );
  }
}
