import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateDonorsEligibilityTable1701949942717
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donors_eligibilities',
        columns: [
          ...genericColumns,
          {
            name: 'donor_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'donation_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'donation_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'next_eligibility_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'donation_ytd',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'donation_ltd',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'donation_last_year',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'donors_eligibilities',
      new TableForeignKey({
        columnNames: ['donor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'donors',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'donors_eligibilities',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'donors_eligibilities',
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
    // Drop the foreign key constraints
    const table = await queryRunner.getTable('donors_eligibilities');
    const foreignKeyTenant = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('tenant_id') !== -1
    );
    const foreignKeyDonor = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('donor_id') !== -1
    );
    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('created_by') !== -1
    );
    await queryRunner.dropForeignKey('bbcs_data_syncs', foreignKeyUser);
    await queryRunner.dropForeignKey('donors_eligibilities', foreignKeyTenant);
    await queryRunner.dropForeignKey('donors_eligibilities', foreignKeyDonor);

    // Drop the table
    await queryRunner.dropTable('donors_eligibilities');
  }
}
