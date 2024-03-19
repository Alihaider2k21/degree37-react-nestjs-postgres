import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import genericHistoryColumns from '../common/generic-history-columns';

export class CreateProspectsHistoryTable1700573848022
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prospects_history',
        columns: [
          ...genericHistoryColumns,
          { name: 'name', type: 'varchar', length: '255' },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },

          { name: 'is_active', type: 'boolean', default: true },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prospects_history');
  }
}
