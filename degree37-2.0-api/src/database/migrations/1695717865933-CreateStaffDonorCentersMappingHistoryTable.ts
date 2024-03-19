import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStaffDonorCentersMappingHistoryTable1695717865933
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the staff_donor_centers_mapping_history table
    await queryRunner.createTable(
      new Table({
        name: 'staff_donor_centers_mapping_history',
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
            name: 'is_active',
            type: 'boolean',
            default: true,
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
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_primary',
            type: 'boolean',
            default: false,
          },
          {
            name: 'staff_id',
            type: 'bigint',
          },
          {
            name: 'donor_center_id',
            type: 'bigint',
          },
        ],
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the staff_donor_centers_mapping_history table
    await queryRunner.dropTable('staff_donor_centers_mapping_history_history');
  }
}
