import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CrmAttachmentsHistoryTable1694699026567
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the crm_attachments table
    await queryRunner.createTable(
      new Table({
        name: 'crm_attachments_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          { name: 'name', type: 'varchar', length: '60', isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'attachmentable_id', type: 'bigint', isNullable: true },
          {
            name: 'attachmentable_type',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'category_id', type: 'bigint', isNullable: true },
          { name: 'sub_category_id', type: 'bigint', isNullable: true },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
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
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the crm_attachments table
    await queryRunner.dropTable('crm_attachments_history');
  }
}
