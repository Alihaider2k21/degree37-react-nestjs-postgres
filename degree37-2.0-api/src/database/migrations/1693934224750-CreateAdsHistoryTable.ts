import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdsHistoryTable1693934224750 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ads_history',
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
            name: 'image_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          {
            name: 'image_url',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'redirect_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'is_archive',
            type: 'boolean',
            default: false,
          },
          {
            name: 'ad_type',
            type: 'enum',
            enum: ['Large Ad', 'Medium Ad', 'Small Ad'],
            isNullable: false,
          },
          {
            name: 'details',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ads_history');
  }
}
