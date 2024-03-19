import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ContactsHistoryTable1694698989560 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contacts_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'contactable_id', type: 'integer', isNullable: false },
          {
            name: 'contactable_type',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          { name: 'contact_type', type: 'int', isNullable: false },
          { name: 'data', type: 'varchar', length: '255', isNullable: false },
          { name: 'is_primary', type: 'boolean', isNullable: true },
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
          { name: 'history_reason', type: 'varchar', length: '1' },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contacts_history');
  }
}
