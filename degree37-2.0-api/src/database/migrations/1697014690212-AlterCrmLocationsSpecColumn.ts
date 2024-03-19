import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterCrmLocationsSpecColumn1697014690212
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'crm_locations_specs',
      'inside_stairs',
      new TableColumn({
        name: 'inside_stairs',
        type: 'bigint',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'crm_locations_specs',
      'inside_stairs',
      new TableColumn({
        name: 'inside_stairs',
        type: 'bigint',
        isNullable: false,
      })
    );
  }
}
