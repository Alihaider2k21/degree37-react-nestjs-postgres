import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUserTableAddColumnAutoCreated1701259211605
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'is_auto_created',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'is_auto_created');
  }
}
