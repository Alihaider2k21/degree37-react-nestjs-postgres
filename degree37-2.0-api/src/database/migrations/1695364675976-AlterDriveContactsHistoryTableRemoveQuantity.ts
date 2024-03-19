import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDriveContactsHistoryTableRemoveQuantity1695364675976
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('drive_contacts_history', 'quantity');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drive_contacts_history',
      new TableColumn({
        name: 'quantity',
        type: 'int',
        isNullable: false,
      })
    );
  }
}
