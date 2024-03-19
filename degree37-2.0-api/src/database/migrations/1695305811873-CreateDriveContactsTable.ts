import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateDriveContactsTable1695305811873
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drive_contacts',
        columns: [
          ...genericColumns,
          {
            name: 'drive_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'accounts_contacts_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            isPrimary: true,
            name: 'role_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'drive_contacts',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drive_contacts',
      new TableForeignKey({
        columnNames: ['drive_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drive_contacts',
      new TableForeignKey({
        columnNames: ['accounts_contacts_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'account_contacts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drive_contacts',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contacts_roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('drive_contacts', 'created_by');
    await queryRunner.dropForeignKey('drive_contacts', 'drive_id');
    await queryRunner.dropForeignKey('drive_contacts', 'accounts_contacts_id');
    await queryRunner.dropForeignKey('drive_contacts', 'role_id');
    // Then, drop the table
    await queryRunner.dropTable('drive_contacts');
  }
}
