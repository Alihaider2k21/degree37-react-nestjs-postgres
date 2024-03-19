import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAddressHistoryTable1693934183960
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'address_history',
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
            name: 'addressable_type',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'address1',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'address2',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          { name: 'city', type: 'varchar', length: '60', isNullable: false },
          { name: 'state', type: 'varchar', length: '60', isNullable: false },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          { name: 'county', type: 'varchar', length: '255', isNullable: true },
          {
            name: 'latitude',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: `'0'::numeric`,
          },
          {
            name: 'longitude',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: `'0'::numeric`,
          },
          { name: 'coordinates', type: 'point', isNullable: true },
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
          { name: 'addressable_id', type: 'bigint', isNullable: false },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('address_history');
  }
}
