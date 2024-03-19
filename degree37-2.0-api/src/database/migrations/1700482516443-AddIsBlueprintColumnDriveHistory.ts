import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsBlueprintColumnDriveHistory1700482516443
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drives_history',
      new TableColumn({
        name: 'is_blueprint',
        type: 'boolean',
        default: false,
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('drives_history', 'is_blueprint');
  }
}
