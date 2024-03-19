import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSiteContactNullableInCrmLcoationHistoryTable1702118266429
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE crm_locations_history ALTER COLUMN site_contact_id DROP NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations_history ALTER COLUMN cross_street DROP NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations_history ALTER COLUMN floor DROP NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE crm_locations_history ALTER COLUMN site_contact_id SET NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations_history ALTER COLUMN cross_street SET NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations_history ALTER COLUMN floor SET NOT NULL'
    );
  }
}
