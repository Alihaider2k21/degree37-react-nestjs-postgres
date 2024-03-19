import {
  TableColumn,
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
} from 'typeorm';

export class AlterCrmLocationSpecsTable1695890087011
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, drop the old column.
    await queryRunner.query(
      'ALTER TABLE crm_locations_specs DROP COLUMN electrical_note;'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations_specs DROP COLUMN special_instructions;'
    );

    await queryRunner.query(
      'ALTER TABLE crm_locations_specs_history DROP COLUMN special_instructions;'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations_specs_history DROP COLUMN electrical_note;'
    );

    // Then, add the modified column.
    await queryRunner.query(
      'ALTER TABLE crm_locations_specs ADD special_instructions VARCHAR(255);'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations_specs ADD electrical_note VARCHAR(255);'
    );

    await queryRunner.query(
      'ALTER TABLE crm_locations_specs_history ADD electrical_note VARCHAR(255);'
    );
    await queryRunner.query(
      'ALTER TABLE crm_locations_specs_history ADD special_instructions VARCHAR(255);'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // To revert the changes, you can do so in the down method.
    // First, drop the modified column.
    await queryRunner.query(
      'ALTER TABLE crm_locations_specs DROP COLUMN electrical_note;'
    );

    await queryRunner.query(
      'ALTER TABLE crm_locations_specs_history DROP COLUMN special_instructions;'
    );

    // Then, add back the old column with the original length.
    await queryRunner.query(
      'ALTER TABLE crm_locations_specs ADD special_instructions VARCHAR(50);'
    );

    await queryRunner.query(
      'ALTER TABLE crm_locations_specs_history ADD electrical_note VARCHAR(50);'
    );
  }
}
