import {
  TableColumn,
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
} from 'typeorm';

export class AlterStaffCertificationHistoryTable1695890087010
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('staff_certification_history');
    const promises = [queryRunner.dropForeignKeys(table, table.foreignKeys)];

    if (!(await queryRunner.hasColumn(table, 'tenant_id')))
      promises.push(
        queryRunner.addColumn(
          table,
          new TableColumn({
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          })
        )
      );

    await Promise.all(promises);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('staff_certification_history');
    const promises = [];

    if (!table.foreignKeys.find((fk) => fk.referencedTableName === 'staff'))
      promises.push(
        queryRunner.createForeignKey(
          table,
          new TableForeignKey({
            columnNames: ['staff_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'staff',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          })
        )
      );

    if (
      !table.foreignKeys.find(
        (fk) => fk.referencedTableName === 'certification'
      )
    )
      promises.push(
        queryRunner.createForeignKey(
          table,
          new TableForeignKey({
            columnNames: ['certificate_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'certification',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          })
        )
      );

    if (await queryRunner.hasColumn(table, 'tenant_id'))
      promises.push(queryRunner.dropColumn(table, 'tenant_id'));

    Promise.all(promises);
  }
}
