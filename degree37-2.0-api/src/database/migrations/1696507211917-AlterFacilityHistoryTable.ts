import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AlterFacilityHistoryTable1696507211917
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('facility_history', 'city');
    await queryRunner.dropColumn('facility_history', 'state');
    await queryRunner.dropColumn('facility_history', 'country');
    await queryRunner.dropColumn('facility_history', 'physical_address');
    await queryRunner.dropColumn('facility_history', 'postal_code');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('facility_history', [
      new TableColumn({
        name: 'city',
        type: 'string',
        default: false,
      }),
      new TableColumn({
        name: 'state',
        type: 'string',
        default: false,
      }),
      new TableColumn({
        name: 'country',
        type: 'string',
        default: false,
      }),
      new TableColumn({
        name: 'physical_address',
        type: 'string',
        default: false,
      }),
      new TableColumn({
        name: 'postal_code',
        type: 'string',
        default: false,
      }),
    ]);
  }
}
