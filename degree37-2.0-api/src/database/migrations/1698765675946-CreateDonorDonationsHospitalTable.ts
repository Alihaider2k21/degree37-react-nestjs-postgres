import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDonorDonationsHospitalTable1698765675946
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donors_donations_hospital',
        columns: [
          { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true },
          {
            name: 'donors_donations_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'hospital',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'date_shipped',
            type: 'timestamp',
            isNullable: true,
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
    await queryRunner.dropTable('donors_donations_hospital');
  }
}
