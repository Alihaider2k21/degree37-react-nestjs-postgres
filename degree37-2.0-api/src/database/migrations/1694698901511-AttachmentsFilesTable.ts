import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AttachmentsFilesTable1694698901511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the attachments_files table
    await queryRunner.createTable(
      new Table({
        name: 'attachments_files',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'attachment_id', type: 'bigint', isNullable: true },
          {
            name: 'attachment_path',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
            isNullable: false,
          },
        ],
      })
    );

    // Create foreign key constraint for attachment_id
    await queryRunner.createForeignKey(
      'attachments_files',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'attachments_files',
      new TableForeignKey({
        columnNames: ['attachment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_attachments',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('attachments_files', 'FK_created_by');
    await queryRunner.dropForeignKey('attachments_files', 'FK_attachment_id');
    // Drop the attachments_files table
    await queryRunner.dropTable('attachments_files');
  }
}
