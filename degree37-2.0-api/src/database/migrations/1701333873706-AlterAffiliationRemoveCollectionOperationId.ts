import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAffiliationRemoveCollectionOperationId1701333873706
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(`affiliation`);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf(`collection_operation_id`) !== -1
    );
    await queryRunner.dropForeignKey(`affiliation`, foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'affiliation',
      new TableColumn({
        name: 'collection_operation_id',
        type: 'bigint',
      })
    );
  }
}
