import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDriveZipCodesHistoryTable1701693223344
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drives_zipcodes_history',
      new TableColumn({ name: 'id', type: 'bigint', isNullable: false })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'drives_zipcodes_history',
      new TableColumn({ name: 'id', type: 'bigint', isNullable: false })
    );
  }
}
