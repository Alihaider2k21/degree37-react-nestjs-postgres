import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAccountAffiliationTable1695494830755
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'account_affiliations',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'account_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'affiliation_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'closeout_date',
            type: 'timestamp',
            isNullable: true,
            default: null,
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
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );

    await queryRunner.createForeignKey(
      'account_affiliations',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'account_affiliations',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'account_affiliations',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'account_affiliations',
      new TableForeignKey({
        columnNames: ['affiliation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'affiliation',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('account_affiliations', 'FK_account_id');
    await queryRunner.dropForeignKey(
      'account_affiliations',
      'FK_affiliation_id'
    );
    await queryRunner.dropForeignKey('account_affiliations', 'FK_created_by');
    await queryRunner.dropForeignKey('account_affiliations', 'FK_tenant_id');
    await queryRunner.dropForeignKey(
      'account_affiliations',
      'FK_affiliation_id'
    );
    // Drop the account_affiliations table
    await queryRunner.dropTable('account_affiliations');
  }
}
