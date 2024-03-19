import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterRemoveCollectionOperationIdFromCrmNonProfilesTable1702202937959
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the column
    await queryRunner.dropColumn(
      'crm_non_collection_profiles',
      'collection_operation_id'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the column
    await queryRunner.addColumn(
      'crm_non_collection_profiles',
      new TableColumn({
        name: 'collection_operation_id',
        type: 'bigint',
      })
    );

    // Recreate the foreign key
    await queryRunner.createForeignKey(
      'crm_non_collection_profiles',
      new TableForeignKey({
        columnNames: ['collection_operation_id'],
        referencedTableName: 'business_units',
        referencedColumnNames: ['id'],
      })
    );
  }
}
