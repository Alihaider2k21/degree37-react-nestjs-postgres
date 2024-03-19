import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterChangelengthLocationDirectionsTable1696507211914
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('location_directions', 'direction');

    await queryRunner.addColumn(
      'location_directions',
      new TableColumn({
        name: 'direction',
        type: 'text',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('location_directions', 'direction');

    await queryRunner.addColumn(
      'location_directions',
      new TableColumn({
        name: 'direction',
        type: 'varchar',
        length: '100',
        isNullable: true,
      })
    );
  }
}
