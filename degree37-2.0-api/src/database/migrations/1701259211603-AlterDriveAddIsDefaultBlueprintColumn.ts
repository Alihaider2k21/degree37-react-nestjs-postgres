import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDriveAddIsDefaultBlueprintColumn1701259211603
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drives',
      new TableColumn({
        name: 'is_default_blueprint',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'drives',
      new TableColumn({
        name: 'is_default_blueprint',
        type: 'boolean',
        default: false,
      })
    );
  }
}
