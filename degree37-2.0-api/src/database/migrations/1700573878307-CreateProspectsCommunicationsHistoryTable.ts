import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import genericHistoryColumns from '../common/generic-history-columns';

export class CreateProspectsCommunicationsHistoryTable1700573878307
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prospects_communications_history',
        columns: [
          ...genericHistoryColumns,
          { name: 'message_type', type: 'varchar', length: '150' },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'prospect_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'template_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'schedule_date',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prospects_communications_history');
  }
}
