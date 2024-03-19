import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateFacilityIndustrySubCategory1701861520703
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'facility_industry_sub_category',
        columns: [
          {
            name: 'facility_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'industry_sub_category_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'facility_industry_sub_category',
      new TableForeignKey({
        columnNames: ['facility_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'facility',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'facility_industry_sub_category',
      new TableForeignKey({
        columnNames: ['industry_sub_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industry_categories',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'facility_industry_sub_category',
      new TableIndex({
        columnNames: ['facility_id'],
      })
    );

    await queryRunner.createIndex(
      'facility_industry_sub_category',
      new TableIndex({
        columnNames: ['industry_sub_category_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey(
      'facility_industry_sub_category',
      'FK_facility_id'
    );
    await queryRunner.dropForeignKey(
      'facility_industry_sub_category',
      'FK_industry_sub_category_id'
    );

    // Drop the table
    await queryRunner.dropTable('facility_industry_sub_category');
  }
}
