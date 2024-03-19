import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import genericHistoryColumns from '../common/generic-history-columns';

export class CreateSessionsPromotionsHistoryTable1699021308285
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sessions_promotions_history',
        columns: [
          ...genericHistoryColumns,
          {
            name: 'session_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'promotion_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sessions_promotions_history', true, true);
  }
}
