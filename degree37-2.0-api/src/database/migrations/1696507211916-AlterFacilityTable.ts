import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AlterFacilityTable1696507211916 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('facility', 'city');
    await queryRunner.dropColumn('facility', 'state');
    await queryRunner.dropColumn('facility', 'country');
    await queryRunner.dropColumn('facility', 'physical_address');
    await queryRunner.dropColumn('facility', 'postal_code');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('facility', [
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
