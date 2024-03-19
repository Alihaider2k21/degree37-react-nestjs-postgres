import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveAddressFromAccounts1695460340444
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accounts', 'mailing_address');
    await queryRunner.dropColumn('accounts', 'zip_code');
    await queryRunner.dropColumn('accounts', 'city');
    await queryRunner.dropColumn('accounts', 'state');
    await queryRunner.dropColumn('accounts', 'country');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('accounts', [
      new TableColumn({
        name: 'mailing_address',
        type: 'varchar',
        length: '255',
        isNullable: false,
      }),
      new TableColumn({
        name: 'zip_code',
        type: 'varchar',
        length: '10',
        isNullable: true,
      }),
      new TableColumn({
        name: 'city',
        type: 'varchar',
        length: '60',
        isNullable: false,
      }),
      new TableColumn({
        name: 'state',
        type: 'varchar',
        length: '60',
        isNullable: false,
      }),
      new TableColumn({
        name: 'country',
        type: 'varchar',
        length: '100',
        isNullable: false,
      }),
    ]);
  }
}
