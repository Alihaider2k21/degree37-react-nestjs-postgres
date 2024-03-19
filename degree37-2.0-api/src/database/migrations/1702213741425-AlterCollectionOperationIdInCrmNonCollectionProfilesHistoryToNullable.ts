import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterCollectionOperationIdInCrmNonCollectionProfilesHistoryToNullable1702213741425
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'crm_non_collection_profiles_history',
      'collection_operation_id',
      new TableColumn({
        name: 'collection_operation_id',
        type: 'bigint',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'crm_non_collection_profiles_history',
      'collection_operation_id',
      new TableColumn({
        name: 'collection_operation_id ',
        type: 'bigint',
        isNullable: false,
      })
    );
  }
}
