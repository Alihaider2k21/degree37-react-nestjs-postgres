import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AlterDirectionsHistoryTable1696507211915
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropForeignKey(
    //   'location_directions_history',
    //   'updated_by'
    // );
    // await queryRunner.dropTable('location_directions_history');
    await queryRunner.createTable(
      new Table({
        name: 'location_directions_history',
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
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'direction',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'miles',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'minutes',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
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
    await queryRunner.dropTable('location_directions_history');
  }
}
