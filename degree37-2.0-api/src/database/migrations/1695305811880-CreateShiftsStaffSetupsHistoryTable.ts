import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateShiftsStaffSetupsHistoryTable1695305811880
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shifts_staff_setups_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'shift_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'staff_setup_id',
            type: 'bigint',
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Then, drop the table
    await queryRunner.dropTable('shifts_staff_setups_history');
  }
}
