import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

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

export class CreateCategoryTable1693934237266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the 'category' table
    await queryRunner.createTable(
      new Table({
        name: 'category',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
            enum: Object.values(typeEnum), // Use the enum values
            default: `'${typeEnum.CRM_ACCOUNTS_ATTACHMENTS}'`,
            isNullable: true,
          },
          {
            name: 'is_archived',
            type: 'boolean',
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
            precision: 6,
            default: 'now()',
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'category',
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'category',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'category',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('category', 'FK_parent_id');
    await queryRunner.dropForeignKey('category', 'FK_created_by');
    await queryRunner.dropForeignKey('category', 'FK_tenant_id');
    // Drop the 'category' table
    await queryRunner.dropTable('category');
  }
}
