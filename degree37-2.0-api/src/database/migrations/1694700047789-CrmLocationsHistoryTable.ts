import { MigrationInterface, QueryRunner, Table } from 'typeorm';
export class CrmLocationsHistory1694700047788 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_locations_history',
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
            name: 'name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'cross_street',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'floor',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'room',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'room_phone',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'site_contact_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'becs_code',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'site_type',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'is_active',
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
    await queryRunner.dropTable('crm_locations_history');
  }
}
