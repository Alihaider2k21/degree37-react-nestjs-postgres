import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ACreateDonorDonationsTable1698765675942
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donors_donations',
        columns: [
          { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true },
          {
            name: 'donor_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'donation_type',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'donation_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'donation_status',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'next_eligibility_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'donation_ytd',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'donation_ltd',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'donation_last_year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'account_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'drive_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'facility_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'points',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );
    await queryRunner.createForeignKey(
      'donors_donations',
      new TableForeignKey({
        columnNames: ['donor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'donor',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_donor_id',
      })
    );
    await queryRunner.createForeignKey(
      'donors_donations',
      new TableForeignKey({
        columnNames: ['donation_type'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure_types',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_donors_donations_procedure_id',
      })
    );
    await queryRunner.createForeignKey(
      'donors_donations',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_donors_donations_account_id',
      })
    );
    await queryRunner.createForeignKey(
      'donors_donations',
      new TableForeignKey({
        columnNames: ['drive_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_donors_donations_drive_id',
      })
    );
    await queryRunner.createForeignKey(
      'donors_donations',
      new TableForeignKey({
        columnNames: ['facility_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'facility',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_donors_donations_facility_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('donors_donations', 'FK_donor_id');
    await queryRunner.dropForeignKey(
      'donors_donations',
      'FK_donors_donations_procedure_id'
    );
    await queryRunner.dropForeignKey(
      'donors_donations',
      'FK_donors_donations_account_id'
    );
    await queryRunner.dropForeignKey(
      'donors_donations',
      'FK_donors_donations_drive_id'
    );
    await queryRunner.dropForeignKey(
      'donors_donations',
      'FK_donors_donations_facility_id'
    );
    await queryRunner.dropTable('donors_donations');
  }
}
