import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDonorCenterBluePrintsHistoryTable1700028883614
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donor_center_blueprints_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          {
            name: 'id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'donorcenter_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'Varchar(60)',
            isNullable: false,
          },
          {
            name: 'oef_products',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'oef_procedures',
            type: 'float',
            isNullable: false,
          },
          { name: 'is_default', type: 'boolean', default: false },
          { name: 'is_active', type: 'boolean', default: false },
          { name: 'monday', type: 'boolean', default: false },
          { name: 'tuesday', type: 'boolean', default: false },
          { name: 'wednesday', type: 'boolean', default: false },
          { name: 'thursday', type: 'boolean', default: false },
          { name: 'friday', type: 'boolean', default: false },
          { name: 'saturday', type: 'boolean', default: false },
          { name: 'sunday', type: 'boolean', default: false },
          {
            name: 'tenant_id',
            type: 'bigint',
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
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Then, drop the table
    await queryRunner.dropTable('donor_center_blueprints_history');
  }
}
