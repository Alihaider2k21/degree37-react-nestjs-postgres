import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import genericHistoryColumns from '../common/generic-history-columns';

export class CreateNonCollectionEventHistory1698135825173
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'oc_non_collection_events_history',
        columns: [
          ...genericHistoryColumns,
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'event_name',
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
            name: 'owner_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'non_collection_profile_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'status_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'event_category_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'event_subcategory_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'approval_status',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('non_collection_event_history');
  }
}
