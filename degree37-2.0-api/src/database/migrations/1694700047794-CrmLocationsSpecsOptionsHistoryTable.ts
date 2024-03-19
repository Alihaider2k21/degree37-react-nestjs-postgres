import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CrmLocationsSpecsOptionsHistoryTable1694700047794
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_locations_specs_options_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          {
            name: 'location_specs_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'specs_key',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'specs_value',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropForeignKey("crm_locations", "FK_site_contact_id");
    // await queryRunner.dropForeignKey("crm_locations_specs", "FK_room_size_id");
    // Then, drop the table
    // await queryRunner.dropTable("shifts_devices");
  }
}
