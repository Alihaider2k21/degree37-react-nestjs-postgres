import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDriveEquipmentsHistoryTable1695305811866
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drive_equipments_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'drive_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'equipment_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
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
            isNullable: false,
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Then, drop the table
    await queryRunner.dropTable('drive_equipments_history');
  }
}
