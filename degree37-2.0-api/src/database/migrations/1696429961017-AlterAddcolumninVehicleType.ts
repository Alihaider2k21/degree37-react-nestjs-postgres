import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAddcolumninVehicleType1696429961017
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'vehicle_type',
      new TableColumn({
        name: 'collection_vehicle',
        type: 'boolean',
        default: true,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('vehicle_type', 'collection_vehicle');
  }
}
