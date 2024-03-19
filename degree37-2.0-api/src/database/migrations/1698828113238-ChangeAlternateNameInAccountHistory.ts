import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeAlternateNameInAccountHistory1698828113238
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'accounts_history',
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
      'accounts_history',
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
