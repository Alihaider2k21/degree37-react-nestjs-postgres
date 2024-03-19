import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ACreateDonorDonationsHistoryTable1698765675943
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donors_donations_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'history_reason', type: 'varchar', length: '1' },
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('donors_donations_history');
  }
}
