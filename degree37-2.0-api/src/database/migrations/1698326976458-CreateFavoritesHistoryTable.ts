import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFavoritesHistoryTable1698326976458
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'favorites_history',
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
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_open_in_new_tab',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'alternate_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'is_default',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'organization_level_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'location_type',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'operation_type',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'preview_in_calendar',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'product_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'procedure_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'operations_status_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'bool',
            isNullable: true,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('favorites_history');
  }
}
