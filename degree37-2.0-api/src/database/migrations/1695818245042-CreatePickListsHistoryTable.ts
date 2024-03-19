import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export enum appliesToTypeEnum {
  ACCOUNTS = '1',
  LOCATIONS = '2',
  DONOR_CENTERS = '3',
  DONORS = '4',
  STAFF = '5',
  VOLUNTEERS = '6',
  DRIVES = '7',
  SESSIONS = '8',
  NCES = '9',
}

export class CreatePicksListsHistoryTable1695818245042
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pick_lists_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'history_reason', type: 'varchar', length: '1' },
          {
            name: 'applies_to',
            type: 'enum',
            enum: Object.values(appliesToTypeEnum),
          },
          {
            name: 'type_name',
            type: 'Varchar(60)',
            isNullable: false,
          },
          {
            name: 'type_value',
            type: 'Varchar(100)',
            isNullable: false,
          },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'custom_field_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Then, drop the table
    await queryRunner.dropTable('pick_lists_history');
  }
}
