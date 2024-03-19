import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAccountHistoryTable1694706708329
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts_history',
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
            name: 'name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'alternate_name',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'mailing_address',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'facebook',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'industry_category',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'industry_subcategory',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'stage',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'source',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'BECS_code',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'collection_operation',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'recruiter',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'territory',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'population',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'RSMO',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts_history');
  }
}
