import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import genericHistoryColumns from '../common/generic-history-columns';

export class CreateBluePrintsHistoryTable1696507211917
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_ncp_blueprints_history',
        columns: [
          ...genericHistoryColumns,
          {
            name: 'crm_non_collection_profiles_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'blueprint_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'location_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'additional_info',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'id_default',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('crm_ncp_blueprints_history');
  }
}
