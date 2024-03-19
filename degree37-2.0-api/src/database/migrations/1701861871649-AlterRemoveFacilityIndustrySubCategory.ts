import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterRemoveFacilityIndustrySubCategory1701861871649
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the column
    await queryRunner.dropColumn('facility', 'industry_sub_category');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the column
    await queryRunner.addColumn(
      'facility',
      new TableColumn({
        name: 'industry_sub_category',
        type: 'bigint',
      })
    );

    // Recreate the foreign key
    await queryRunner.createForeignKey(
      'facility',
      new TableForeignKey({
        columnNames: ['industry_sub_category'],
        referencedTableName: 'industry_categories',
        referencedColumnNames: ['id'],
      })
    );
  }
}
