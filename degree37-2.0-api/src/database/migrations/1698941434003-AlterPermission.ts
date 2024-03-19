import { MigrationInterface, QueryRunner } from 'typeorm';
export class AlterPermissions1698941434003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the "permissions" repository
    /**
     * Step 1: Get application_id where name = System Configuration
     * Step 2: Get all role_permissions where application_id = step1's application_id
     * Step 3: Delete all role permissions of step 2
     **/
    await queryRunner.query(
      `DELETE FROM role_permission WHERE permission_id IN (SELECT id FROM permissions WHERE application_id = (Select id from applications where name = 'System Configuration'))`
    );
    /**
     * Step 1: Get application_id where name = System Configuration
     * Step 2: Delete all permissions of application id = step1's app id
     **/
    await queryRunner.query(
      `DELETE FROM permissions WHERE application_id = (Select id from applications where name = 'System Configuration')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // null here
  }
}
