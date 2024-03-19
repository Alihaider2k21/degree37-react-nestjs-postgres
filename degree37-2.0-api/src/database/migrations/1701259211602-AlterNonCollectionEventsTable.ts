import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterNonCollectionEventsTable1701259211602
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'oc_non_collection_events',
      'event_subcategory_id',
      new TableColumn({
        name: 'event_subcategory_id',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'oc_non_collection_events_history',
      'event_subcategory_id',
      new TableColumn({
        name: 'event_subcategory_id',
        type: 'bigint',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'oc_non_collection_events',
      'event_subcategory_id',
      new TableColumn({
        name: 'event_subcategory_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'oc_non_collection_events_history',
      'event_subcategory_id',
      new TableColumn({
        name: 'event_subcategory_id',
        type: 'bigint',
        isNullable: false,
      })
    );
  }
}
