import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDriveContactsTableRemoveQuantity1695364675975
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('drive_contacts', 'quantity');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drive_contacts',
      new TableColumn({
        name: 'quantity',
        type: 'int',
        isNullable: false,
      })
    );
  }
}
