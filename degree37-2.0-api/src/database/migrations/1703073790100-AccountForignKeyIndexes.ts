import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountForignKeyIndexes1703073790100
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX idx_industry_category ON accounts (industry_category)`
    );
    await queryRunner.query(
      `CREATE INDEX idx_industry_subcategory ON accounts (industry_subcategory)`
    );
    await queryRunner.query(`CREATE INDEX idx_stage ON accounts (stage)`);
    await queryRunner.query(`CREATE INDEX idx_source ON accounts (source)`);
    await queryRunner.query(
      `CREATE INDEX idx_collection_operation ON accounts (collection_operation)`
    );
    await queryRunner.query(
      `CREATE INDEX idx_recruiter ON accounts (recruiter)`
    );
    await queryRunner.query(
      `CREATE INDEX idx_territory ON accounts (territory)`
    );
    await queryRunner.query(
      `CREATE INDEX idx_tenant_id ON accounts (tenant_id)`
    );
    await queryRunner.query(
      `CREATE INDEX idx_created_by ON accounts (created_by)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX idx_industry_category`);
    await queryRunner.query(`DROP INDEX idx_industry_subcategory`);
    await queryRunner.query(`DROP INDEX idx_stage`);
    await queryRunner.query(`DROP INDEX idx_source`);
    await queryRunner.query(`DROP INDEX idx_collection_operation`);
    await queryRunner.query(`DROP INDEX idx_recruiter`);
    await queryRunner.query(`DROP INDEX idx_territory`);
    await queryRunner.query(`DROP INDEX idx_tenant_id`);
    await queryRunner.query(`DROP INDEX idx_created_by`);
  }
}
