import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAccountBECScodeColumn1702983235396
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "accounts" ALTER COLUMN "BECS_code" TYPE character varying(5);'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
