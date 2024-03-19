import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterChangeTypeDateInVehicleShareTable1702314752018
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alter the type of the start_date column to timestamptz
    await queryRunner.query(
      'ALTER TABLE vehicle_share ALTER COLUMN start_date TYPE timestamptz USING start_date::timestamptz'
    );

    // Alter the type of the end_date column to timestamptz
    await queryRunner.query(
      'ALTER TABLE vehicle_share ALTER COLUMN end_date TYPE timestamptz USING end_date::timestamptz'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the change for start_date if necessary
    await queryRunner.query(
      'ALTER TABLE vehicle_share ALTER COLUMN start_date TYPE date USING start_date::date'
    );

    // Revert the change for end_date if necessary
    await queryRunner.query(
      'ALTER TABLE vehicle_share ALTER COLUMN end_date TYPE date USING end_date::date'
    );
  }
}
