import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AprovalsHistoryTable1694698862434 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the aprovals_history table
    await queryRunner.createTable(
      new Table({
        name: 'aprovals_history',
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
          { name: 'promotional_items', type: 'boolean', isNullable: true },
          { name: 'marketing_materials', type: 'boolean', isNullable: true },
          { name: 'tele_recruitment', type: 'boolean', isNullable: true },
          { name: 'email', type: 'boolean', isNullable: true },
          { name: 'sms_texting', type: 'boolean', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          { name: 'created_by_id', type: 'bigint', isNullable: false },
          { name: 'user_id', type: 'bigint' },
          { name: 'updated_by', type: 'bigint', isNullable: false },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the aprovals_history table
    await queryRunner.dropTable('aprovals_history');
  }
}
