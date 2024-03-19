import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterApprovalsTableAddTenantId1697839852309
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'approval',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: true,
      })
    );
    await queryRunner.createForeignKey(
      'approval',
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
    const table = await queryRunner.getTable('approval');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('tenant_id') !== -1
    );
    await queryRunner.dropForeignKey('approval', foreignKey);
    await queryRunner.dropColumn('approval', 'tenant_id');
  }
}
