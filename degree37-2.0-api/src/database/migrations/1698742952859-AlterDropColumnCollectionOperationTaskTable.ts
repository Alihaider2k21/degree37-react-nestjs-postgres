import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDropColumnCollectionOperationTaskTable1698742952859
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('task', 'collection_operation');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'task',
      new TableColumn({
        name: 'collection_operation',
        type: 'varchar',
      })
    );
  }
}
