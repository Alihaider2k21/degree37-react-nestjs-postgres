import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveBusinessUnitFromUserHistory1701424576702
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('user_history', 'business_unit')) {
      await queryRunner.dropColumn('user_history', 'business_unit');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('user_history', 'business_unit'))) {
      await queryRunner.addColumn(
        'user_history',
        new TableColumn({
          name: 'business_unit',
          type: 'bigint',
          isNullable: true,
        })
      );
    }
  }
}
