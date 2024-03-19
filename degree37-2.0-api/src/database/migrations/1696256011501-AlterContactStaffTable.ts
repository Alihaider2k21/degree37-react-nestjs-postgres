import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterContactStaffTable1696256011501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('staff', 'title');

    await queryRunner.addColumn(
      'staff',
      new TableColumn({
        name: 'nick_name',
        type: 'varchar',
        length: '60',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('staff', 'nick_name');

    await queryRunner.addColumn(
      'staff',
      new TableColumn({
        name: 'title',
        type: 'varchar',
        length: '60',
        isNullable: true,
      })
    );
  }
}
