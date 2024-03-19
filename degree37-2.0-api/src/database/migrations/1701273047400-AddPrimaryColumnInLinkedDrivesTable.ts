import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPrimaryColumnInLinkedDrivesTable1701273047400
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'linked_drives',
      new TableColumn({
        name: 'id',
        type: 'bigint',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('linked_drives', 'id');
  }
}
