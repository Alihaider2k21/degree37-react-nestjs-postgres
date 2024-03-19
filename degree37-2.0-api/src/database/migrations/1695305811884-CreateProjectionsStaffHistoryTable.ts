import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProjectionsStaffHistoryTable1695305811883
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shifts_projetions_staff_history',
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
            name: 'shift_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'procedure_type_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'staff_setup_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'product_yield',
            type: 'int',
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
    await queryRunner.dropTable('shifts_projetions_staff_history');
  }
}
