import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NotesHistoryTable1694697495690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the Notes table
    await queryRunner.createTable(
      new Table({
        name: 'notes_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'noteable_id', type: 'bigint', isNullable: true },
          {
            name: 'noteable_type',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'note_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          { name: 'details', type: 'text', isNullable: true },
          { name: 'category_id', type: 'bigint', isNullable: true },
          { name: 'sub_category_id', type: 'bigint', isNullable: true },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the Notes table
    await queryRunner.dropTable('notes_history');
  }
}
