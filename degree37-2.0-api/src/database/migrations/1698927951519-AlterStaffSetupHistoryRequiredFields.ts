import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterStaffSetupHistoryRequiredFields1698927951519
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE staff_setup_history ALTER COLUMN concurrent_beds DROP NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE staff_setup_history ALTER COLUMN concurrent_beds DROP DEFAULT'
    );

    await queryRunner.query(
      'ALTER TABLE staff_setup_history ALTER COLUMN stagger_slots DROP NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE staff_setup_history ALTER COLUMN stagger_slots DROP DEFAULT'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE staff_setup_history ALTER COLUMN concurrent_beds SET NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE staff_setup_history ALTER COLUMN concurrent_beds SET DEFAULT 1'
    );

    await queryRunner.query(
      'ALTER TABLE staff_setup_history ALTER COLUMN stagger_slots SET NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE staff_setup_history ALTER COLUMN stagger_slots SET DEFAULT 1'
    );
  }
}
