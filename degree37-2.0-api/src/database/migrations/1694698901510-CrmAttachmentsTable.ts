import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CrmAttachmentsTable1694698901510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the crm_attachments table
    await queryRunner.createTable(
      new Table({
        name: 'crm_attachments',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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

    await queryRunner.createForeignKey(
      'crm_attachments',
      new TableForeignKey({
        columnNames: ['sub_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_attachments',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_attachments',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_attachments',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('crm_attachments', 'FK_sub_category_id');
    await queryRunner.dropForeignKey('crm_attachments', 'FK_tenant_id');
    await queryRunner.dropForeignKey('crm_attachments', 'FK_category_id');
    await queryRunner.dropForeignKey('crm_attachments', 'FK_created_by');
    // Drop the crm_attachments table
    await queryRunner.dropTable('crm_attachments');
  }
}
