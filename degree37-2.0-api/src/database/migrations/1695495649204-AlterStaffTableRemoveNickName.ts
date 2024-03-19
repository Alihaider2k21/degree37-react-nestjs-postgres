import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
export class AlterStaffTableRemoveNickName1695495649204
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'staff',
      new TableColumn({
        name: 'nick_name',
        type: 'varchar',
        length: '60',
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'staff',
      new TableColumn({
        name: 'nick_name',
        type: 'varchar',
        length: '60',
        isNullable: false,
      })
    );
  }
}
