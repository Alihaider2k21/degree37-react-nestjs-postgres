import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterTableDonorAddSuffixID1702376326599
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('donors');
    if (!(await queryRunner.hasColumn(table, 'suffix_id'))) {
      await queryRunner.addColumn(
        table,
        new TableColumn({
          name: 'suffix_id',
          type: 'bigint',
          isNullable: true,
        })
      );
      if (!table.foreignKeys.some((fk) => fk.columnNames.includes('suffix_id')))
        await queryRunner.createForeignKey(
          table,
          new TableForeignKey({
            columnNames: ['suffix_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'suffixes',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          })
        );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('donors');
    if (await queryRunner.hasColumn(table, 'suffix_id')) {
      await queryRunner.dropColumn(table, 'suffix_id');
      const foreignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('suffix_id')
      );
      if (foreignKey) await queryRunner.dropForeignKey(table, foreignKey);
    }
  }
}
