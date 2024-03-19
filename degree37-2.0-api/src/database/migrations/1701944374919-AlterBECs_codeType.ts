import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterBECsCodeType1701944374919 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      // queryRunner.query(
      //   'ALTER TABLE accounts RENAME COLUMN "BECS_code" To becs_code'
      // ),
      queryRunner.query(
        'ALTER TABLE accounts ALTER COLUMN "BECS_code" TYPE varchar(255)'
      ),
      queryRunner.query(
        'ALTER TABLE accounts_history ALTER COLUMN "BECS_code" TYPE varchar(255)'
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        'ALTER TABLE accounts ALTER COLUMN "BECS_code" TYPE float'
      ),
      queryRunner.query(
        'ALTER TABLE accounts_history ALTER COLUMN "BECS_code" TYPE float'
      ),
    ]);
  }
}
