import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveBusinessUnitFromUser1701214230424
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('user', 'business_unit')) {
      await queryRunner.dropColumn('user', 'business_unit');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('user', 'business_unit'))) {
      await queryRunner.addColumn(
        'user',
        new TableColumn({
          name: 'business_unit',
          type: 'bigint',
          isNullable: true,
        })
      );
    }
  }
}
