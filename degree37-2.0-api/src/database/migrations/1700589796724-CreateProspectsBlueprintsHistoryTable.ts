import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import genericHistoryColumns from '../common/generic-history-columns';

export class CreateProspectsBlueprintsHistoryTable1700589796724
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prospects_blueprints_history',
        columns: [
          ...genericHistoryColumns,

          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'prospect_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'blueprint_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prospects_blueprints_history');
  }
}
