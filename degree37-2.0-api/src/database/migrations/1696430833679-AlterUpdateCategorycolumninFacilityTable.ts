import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterUpdateCategorycolumninFacilityTable1696430833679
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the existing columns
    await queryRunner.dropColumn('facility', 'industry_category');
    await queryRunner.dropColumn('facility', 'industry_sub_category');

    // Add new columns with foreign key relationships
    await queryRunner.addColumn(
      'facility',
      new TableColumn({
        name: 'industry_category',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'facility',
      new TableColumn({
        name: 'industry_sub_category',
        type: 'bigint',
        isNullable: true,
      })
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      'facility',
      new TableForeignKey({
        columnNames: ['industry_category'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industry_categories',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'facility',
      new TableForeignKey({
        columnNames: ['industry_sub_category'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industry_categories',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey('facility', 'FK_industry_category');
    await queryRunner.dropForeignKey('facility', 'FK_industry_sub_category');

    // Drop the new columns
    await queryRunner.dropColumn('facility', 'industry_category');
    await queryRunner.dropColumn('facility', 'industry_sub_category');

    // Recreate the previous columns
    await queryRunner.addColumn(
      'facility',
      new TableColumn({
        name: 'industry_category',
        type: 'varchar',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'facility',
      new TableColumn({
        name: 'industry_sub_category',
        type: 'varchar',
        isNullable: false,
      })
    );
  }
}
