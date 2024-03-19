import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateShiftsHistoryTable1695305811876
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shifts_history',
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
            name: 'shiftable_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'shiftable_type',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'start_time',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_time',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'break_start_time',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'break_end_time',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'reduction_percentage',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'reduce_slots',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'oef_procedures',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'oef_products',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
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
    // Then, drop the table
    await queryRunner.dropTable('shifts_history');
  }
}
