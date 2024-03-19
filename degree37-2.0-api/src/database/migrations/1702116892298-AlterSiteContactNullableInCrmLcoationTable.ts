import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSiteContactNullableInCrmLcoationTable1702116892298
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE crm_locations ALTER COLUMN site_contact_id DROP NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations ALTER COLUMN cross_street DROP NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations ALTER COLUMN floor DROP NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE crm_locations ALTER COLUMN site_contact_id SET NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations ALTER COLUMN cross_street SET NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations ALTER COLUMN cross_street SET NOT NULL'
    );
  }
}
