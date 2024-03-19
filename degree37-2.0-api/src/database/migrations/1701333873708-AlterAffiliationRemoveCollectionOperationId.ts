import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAffiliationRemoveCollectionOperationId1701333873708
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('affiliation', 'collection_operation_id'))
      await queryRunner.dropColumn(
        'affiliation',
        new TableColumn({
          name: 'collection_operation_id',
          type: 'bigint',
        })
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await new Promise((resolve, reject) => {
      resolve(1);
    });
  }
}
