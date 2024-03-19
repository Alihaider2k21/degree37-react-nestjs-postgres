import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterOcNonCollectionProfileTable1698135825174
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'crm_non_collection_profiles',
      'owner_id ',
      new TableColumn({
        name: 'owner_id',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'crm_non_collection_profiles',
      'event_subcategory_id ',
      new TableColumn({
        name: 'event_subcategory_id',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'crm_non_collection_profiles',
      'collection_operation_id ',
      new TableColumn({
        name: 'collection_operation_id',
        type: 'bigint',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'crm_non_collection_profiles',
      'event_subcategory_id',
      new TableColumn({
        name: 'event_subcategory_id ',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'crm_non_collection_profiles',
      'collection_operation_id',
      new TableColumn({
        name: 'collection_operation_id ',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'crm_non_collection_profiles',
      'owner_id',
      new TableColumn({
        name: 'owner_id ',
        type: 'bigint',
        isNullable: true,
      })
    );
  }
}
