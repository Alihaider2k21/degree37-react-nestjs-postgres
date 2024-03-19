import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class DrivesDonorCommunicationSupplementalAccounts1695305811867
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drives_donor_comms_supp_accounts',
        columns: [
          {
            name: 'drive_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            isPrimary: true,
            name: 'account_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'drives_donor_comms_supp_accounts',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives_donor_comms_supp_accounts',
      new TableForeignKey({
        columnNames: ['drive_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives_donor_comms_supp_accounts',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'drives_donor_comms_supp_accounts',
      'created_by'
    );
    await queryRunner.dropForeignKey(
      'drives_donor_comms_supp_accounts',
      'drive_id'
    );
    await queryRunner.dropForeignKey(
      'drives_donor_comms_supp_accounts',
      'account_id'
    );
    // Then, drop the table
    await queryRunner.dropTable('drives_donor_comms_supp_accounts');
  }
}
