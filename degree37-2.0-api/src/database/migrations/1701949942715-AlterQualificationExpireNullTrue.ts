import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterQualificationExpireNullTrue1701949942715
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE qualifications ALTER COLUMN qualification_expires DROP NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE qualifications ALTER COLUMN qualification_expires SET NOT NULL'
    );
  }
}
