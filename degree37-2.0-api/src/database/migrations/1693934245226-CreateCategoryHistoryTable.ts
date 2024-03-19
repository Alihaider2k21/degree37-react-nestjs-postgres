import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export enum typeEnum {
  'OPERATION_NEC_NEC' = 'OPERATION_NEC_NEC', // Operation Menu -> Non Collection Events -> NCE
  'OPERATION_NOTES_ATTACHMENTS_NOTES' = 'OPERATION_NOTES_ATTACHMENTS_NOTES', //Operations Menu -> Notes & Attachments -> Notes
  'OPERATION_NOTES_ATTACHMENTS_ATTACHMENTS' = 'OPERATION_NOTES_ATTACHMENTS_ATTACHMENTS', //Operations Menu -> Notes & Attachments -> Attachments
  'OPERATION_NOTES_ATTACHMENTS_ATTACHMENTS_CATEGORY' = 'OPERATION_NOTES_ATTACHMENTS_ATTACHMENTS_CATEGORY', //Operations Menu -> Notes & Attachments -> Attachments Category
  'CRM_ACCOUNTS_ATTACHMENTS' = 'CRM_ACCOUNTS_ATTACHMENTS', //CRM Menu -> Accounts -> Attachments
  'CRM_ACCOUNTS_NOTES' = 'CRM_ACCOUNTS_NOTES', //CRM Menu -> Accounts -> Notes
  'CRM_CONTACTS_ATTACHMENTS' = 'CRM_CONTACTS_ATTACHMENTS', //CRM Menu -> Contacts -> Attachments
  'CRM_CONTACTS_NOTES' = 'CRM_CONTACTS_NOTES', //CRM Menu -> Contacts -> Notes
  'CRM_LOCATION_ATTACHMENTS' = 'CRM_LOCATION_ATTACHMENTS', //CRM Menu -> Location -> Attachments
  'CRM_LOCATION_NOTES' = 'CRM_LOCATION_NOTES', //CRM Menu -> Location -> Notes
  'CRM_ACCOUNTS_SOURCES' = 'CRM_ACCOUNTS_SOURCES', //CRM Menu -> Accounts -> Sources
  'CRM_ACCOUNTS_STAGE' = 'CRM_ACCOUNTS_STAGE', //CRM Menu -> Accounts -> Stage
  'CRM_CONTACTS_FUNCTIONS' = 'CRM_CONTACTS_FUNCTIONS', //CRM Menu -> Contacts -> Functions
}

export class CreateCategoryHistoryTable1693934245226
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'category_history',
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
            name: 'history_reason',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(typeEnum),
            default: `'${typeEnum.CRM_ACCOUNTS_ATTACHMENTS}'`,
            isNullable: true,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'parent_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'integer',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('category_history');
  }
}
