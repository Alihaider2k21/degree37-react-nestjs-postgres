import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';
import genericForeignKeys from '../common/generic-foreignkeys';

export class CreateSessionsPromotionsTable1699019710065
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sessions_promotions',
        columns: [
          ...genericColumns,
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
    await queryRunner.createForeignKeys('sessions_promotions', [
      ...genericForeignKeys,
      new TableForeignKey({
        columnNames: ['session_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sessions',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
      new TableForeignKey({
        columnNames: ['promotion_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'promotion_entity',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('sessions_promotions');
    await queryRunner.dropForeignKeys(table, table.foreignKeys);
    await queryRunner.dropTable(table, true);
  }
}
