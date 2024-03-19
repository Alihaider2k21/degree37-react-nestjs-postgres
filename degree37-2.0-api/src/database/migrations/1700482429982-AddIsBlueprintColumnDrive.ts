import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsBlueprintColumnDrive1700482429982
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drives',
      new TableColumn({
        name: 'is_blueprint',
        type: 'boolean',
        default: false,
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('drives', 'is_blueprint');
  }
}
