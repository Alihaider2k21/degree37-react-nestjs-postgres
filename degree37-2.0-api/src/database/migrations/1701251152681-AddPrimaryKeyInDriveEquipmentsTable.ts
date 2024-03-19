import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPrimaryKeyInDriveEquipmentsTable1701251152681
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drives_equipments',
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
    await queryRunner.dropColumn('drives_equipments', 'id');
  }
}
