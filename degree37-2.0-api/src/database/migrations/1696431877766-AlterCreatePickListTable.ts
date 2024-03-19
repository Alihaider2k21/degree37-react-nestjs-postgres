import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterCreatePickListTable1696431877766
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'pick_lists',
      new TableColumn({
        name: 'sort_order',
        type: 'bigint',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pick_lists', 'sort_order');
  }
}
