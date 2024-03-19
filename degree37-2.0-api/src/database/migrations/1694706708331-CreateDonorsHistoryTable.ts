import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDonorsHistoryTable1694706708331
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the donors table
    await queryRunner.createTable(
      new Table({
        name: 'donors_history',
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
            name: 'external_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'prefix_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'suffix_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'birth_date',
            type: 'timestamp',
            precision: 6,
            isNullable: false,
          },
          {
            name: 'nick_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'blood_type',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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

    await queryRunner.createForeignKey(
      'donors_history',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('donors_history', 'FK_tenant_id');
    // Then, drop the table
    await queryRunner.dropTable('donors_history');
  }
}
