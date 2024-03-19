import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AccountContactsTable1694698361358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the account_contacts table
    await queryRunner.createTable(
      new Table({
        name: 'account_contacts',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'account_id', type: 'bigint', isNullable: false },
          { name: 'contact_id', type: 'bigint', isNullable: false },
          { name: 'created_by', type: 'bigint', isNullable: false },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'account_contacts',
      new TableForeignKey({
        columnNames: ['contact_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'account_contacts',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'account_contacts',
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
    await queryRunner.dropForeignKey('account_contacts', 'FK_contact_id');
    await queryRunner.dropForeignKey('account_contacts', 'FK_account_id');
    await queryRunner.dropForeignKey('account_contacts', 'FK_created_by');
    // Drop the account_contacts table
    await queryRunner.dropTable('account_contacts');
  }
}
