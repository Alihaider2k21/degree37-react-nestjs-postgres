import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterDonorEligibilityDonationType1702127874409
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('donors_eligibilities', 'donation_type')) {
      await queryRunner.clearTable('donors_eligibilities');
      await queryRunner.query(`
        ALTER TABLE 
          donors_eligibilities 
        ALTER COLUMN 
          donation_type TYPE BIGINT USING donation_type::BIGINT,
        ALTER COLUMN 
          donation_type SET NOT NULL;
      `);
      await queryRunner.createForeignKey(
        'donors_eligibilities',
        new TableForeignKey({
          columnNames: ['donation_type'],
          referencedColumnNames: ['id'],
          referencedTableName: 'procedure',
          onDelete: 'NO ACTION',
          onUpdate: 'NO ACTION',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('donors_eligibilities');
    const foreignKey = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('donation_type')
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey(table, foreignKey);
    }
    await queryRunner.clearTable('donors_eligibilities');
    await queryRunner.query(`
      ALTER TABLE 
        donors_eligibilities 
      ALTER COLUMN 
        donation_type TYPE VARCHAR(250) USING donation_type::VARCHAR,
      ALTER COLUMN 
        donation_type DROP NOT NULL;
    `);
  }
}
