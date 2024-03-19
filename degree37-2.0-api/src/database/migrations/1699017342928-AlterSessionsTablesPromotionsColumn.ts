import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterSessionsTablesPromotionsColumn1699017342928
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('sessions');
    await queryRunner.dropForeignKey(
      table,
      table.foreignKeys.find((fk) => fk.columnNames.includes('promotion_id'))
    );
    await Promise.all([
      queryRunner.dropColumn(table, 'promotion_id'),
      queryRunner.dropColumn('sessions_history', 'promotion_id'),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'sessions',
      new TableColumn({
        name: 'promotion_id',
        type: 'bigint',
        isNullable: false,
      })
    );
    await Promise.all([
      queryRunner.createForeignKey(
        'sessions',
        new TableForeignKey({
          columnNames: ['promotion_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'promotion_entity',
          onDelete: 'NO ACTION',
          onUpdate: 'NO ACTION',
        })
      ),
      queryRunner.addColumn(
        'sessions_history',
        new TableColumn({
          name: 'promotion_id',
          type: 'bigint',
          isNullable: false,
        })
      ),
    ]);
  }
}
