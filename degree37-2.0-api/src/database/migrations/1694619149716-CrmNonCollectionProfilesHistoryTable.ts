import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CrmNonCollectionProfilesHistoryTable1694619149716
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_non_collection_profiles_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'profile_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'alternate_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'event_category_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'event_subcategory_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'owner_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('crm_non_collection_profiles_history');
  }
}
