import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddTenatIdForAccounts1695812823950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: true,
      })
    );
    await queryRunner.createForeignKey(
      'accounts',
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
    const table = await queryRunner.getTable('accounts');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('tenant_id') !== -1
    );
    await queryRunner.dropForeignKey('accounts', foreignKey);
    await queryRunner.dropColumn('accounts', 'tenant_id');
  }
}
