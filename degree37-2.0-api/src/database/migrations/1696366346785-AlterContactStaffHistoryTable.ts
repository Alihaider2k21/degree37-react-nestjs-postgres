import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterContactStaffHistoryTable1696366346785
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('staff_history', 'title');

    await queryRunner.addColumn(
      'staff_history',
      new TableColumn({
        name: 'nick_name',
        type: 'varchar',
        length: '60',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('staff_history', 'nick_name');

    await queryRunner.addColumn(
      'staff_history',
      new TableColumn({
        name: 'title',
        type: 'varchar',
        length: '60',
        isNullable: true,
      })
    );
  }
}
