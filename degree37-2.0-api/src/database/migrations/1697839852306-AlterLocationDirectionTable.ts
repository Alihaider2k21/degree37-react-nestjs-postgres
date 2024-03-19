import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterLocationDirectionTable1697839852306
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('location_directions', [
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('location_directions', [
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: true,
      }),
    ]);
  }
}
