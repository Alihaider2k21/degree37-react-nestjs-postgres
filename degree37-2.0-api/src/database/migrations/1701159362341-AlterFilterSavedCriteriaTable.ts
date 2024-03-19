import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFilterSavedCriteriaTable1701159362341
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      (await queryRunner.hasTable('filter_saved_criteria')) &&
      (await queryRunner.hasColumn(
        'filter_saved_criteria',
        'filter_saved_value'
      ))
    )
      await queryRunner.query(`
        ALTER TABLE filter_saved_criteria
        ALTER COLUMN filter_saved_value TYPE VARCHAR(250);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (
      (await queryRunner.hasTable('filter_saved_criteria')) &&
      (await queryRunner.hasColumn(
        'filter_saved_criteria',
        'filter_saved_value'
      ))
    )
      await queryRunner.query(`
        ALTER TABLE filter_saved_criteria
        ALTER COLUMN filter_saved_value TYPE VARCHAR(60);
      `);
  }
}
