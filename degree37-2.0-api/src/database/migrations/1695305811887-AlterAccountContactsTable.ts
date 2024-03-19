import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export class AlterAccountContactsTable1695305811887
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('account_contacts', [
      new TableColumn({
        name: 'record_id',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'contactable_id',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'role_id',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'contactable_type',
        type: 'varchar',
        length: '60',
        isNullable: false,
      }),
      new TableColumn({
        name: 'closeout_date',
        type: 'timestamp',
        precision: 6,
        default: null,
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_archived',
        type: 'boolean',
        default: false,
      }),
    ]);
    await queryRunner.createForeignKey(
      'account_contacts',
      new TableForeignKey({
        columnNames: ['record_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_volunteer',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'account_contacts',
      new TableForeignKey({
        columnNames: ['contactable_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'account_contacts',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contacts_roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.dropColumns('account_contacts', [
      new TableColumn({
        name: 'account_id',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'contact_id',
        type: 'bigint',
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('account_contacts', [
      new TableColumn({
        name: 'record_id',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'contactable_id',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'role_id',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'contactable_type',
        type: 'varchar',
        length: '60',
        isNullable: false,
      }),
      new TableColumn({
        name: 'closeout_date',
        type: 'timestamp',
        precision: 6,
        default: null,
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_archived',
        type: 'boolean',
        default: false,
      }),
    ]);
    await queryRunner.addColumns('account_contacts', [
      new TableColumn({
        name: 'account_id',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'contact_id',
        type: 'bigint',
        isNullable: false,
      }),
    ]);
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
  }
}
