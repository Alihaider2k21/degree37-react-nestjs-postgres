import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAccountsContactHistoryTable1695643562254
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'account_contacts_history',
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
            name: 'contactable_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'record_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'role_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'contactable_type',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'closeout_date',
            type: 'timestamp',
            default: null,
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
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('account_contacts_history');
  }
}
