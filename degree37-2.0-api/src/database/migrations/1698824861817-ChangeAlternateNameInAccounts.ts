import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeAlternateNameInAccounts1698824861817
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'accounts',
      'alternate_name',
      new TableColumn({
        name: 'alternate_name',
        type: 'varchar',
        length: '60',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'accounts',
      'alternate_name',
      new TableColumn({
        name: 'alternate_name',
        type: 'varchar',
        length: '20',
        isNullable: true,
      })
    );
  }
}
