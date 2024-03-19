import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
export class AlterProcedureTableAddColumnCredits1702396281874
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE procedure ADD COLUMN credits INT DEFAULT 0 NOT NULL'
    );
    // Add a check constraint for values between 0 and 999
    await queryRunner.query(
      'ALTER TABLE procedure ADD CONSTRAINT CHK_credits_range CHECK (credits >= 0 AND credits <= 999)'
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE procedure ADD COLUMN credits INT DEFAULT 0 NOT NULL'
    );
    // Add a check constraint for values between 0 and 999
    await queryRunner.query(
      'ALTER TABLE procedure ADD CONSTRAINT CHK_credits_range CHECK (credits >= 0 AND credits <= 999)'
    );
  }
}
