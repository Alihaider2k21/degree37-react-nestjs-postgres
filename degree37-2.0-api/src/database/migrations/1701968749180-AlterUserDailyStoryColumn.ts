import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUserDailyStoryColumn1701968749180
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'dailystory_useruid',
        type: 'text',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'dailystory_tenant_uid');
  }
}
