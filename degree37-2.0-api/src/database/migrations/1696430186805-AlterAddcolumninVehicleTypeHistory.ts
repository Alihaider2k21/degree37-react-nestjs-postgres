import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAddcolumninVehicleTypeHistory1696430186805
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'vehicle_type_history',
      new TableColumn({
        name: 'collection_vehicle',
        type: 'boolean',
        default: true,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('vehicle_type_history', 'collection_vehicle');
  }
}
