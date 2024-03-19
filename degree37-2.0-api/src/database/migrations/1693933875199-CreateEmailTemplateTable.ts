import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateEmailTemplateTable1693933875199
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'email_template',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'subject', type: 'varchar' },
          { name: 'content', type: 'text' },
          {
            name: 'template_type',
            type: 'enum',
            enum: ['Donor', 'Admin'],
            default: `'Admin'`,
          },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'templateId', type: 'bigint', isNullable: true },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'email_template',
      new TableForeignKey({
        columnNames: ['templateId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'templates',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('email_template', 'FK_templateId');

    // Drop the "email_template" table
    await queryRunner.dropTable('email_template');
  }
}
