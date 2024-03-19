import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CrmLocationsSpecsHistoryTable1694700047791
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_locations_specs_history',
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
            name: 'location_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'room_size_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'elevator',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'inside_stairs',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'outside_stairs',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'electrical_note',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'special_instructions',
            type: 'varchar',
            length: '60',
            isNullable: true,
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
    await queryRunner.dropTable('crm_locations_specs_history');
  }
}
