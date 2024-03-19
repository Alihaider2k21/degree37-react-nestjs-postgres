import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CrmNonCollectionProfilesTable1694619128070
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_non_collection_profiles',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'profile_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'alternate_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'event_category_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'event_subcategory_id ',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'collection_operation_id ',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'owner_id ',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'crm_non_collection_profiles',
      new TableForeignKey({
        columnNames: ['event_subcategory_id '],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_non_collection_profiles',
      new TableForeignKey({
        columnNames: ['event_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_non_collection_profiles',
      new TableForeignKey({
        columnNames: ['collection_operation_id '],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_non_collection_profiles',
      new TableForeignKey({
        columnNames: ['owner_id '],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_non_collection_profiles',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_non_collection_profiles',
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
    await queryRunner.dropForeignKey(
      'crm_non_collection_profiles',
      'FK_event_subcategory_id '
    );
    await queryRunner.dropForeignKey(
      'crm_non_collection_profiles',
      'FK_event_category_id'
    );
    await queryRunner.dropForeignKey(
      'crm_non_collection_profiles',
      'FK_collection_operation_id '
    );
    await queryRunner.dropForeignKey(
      'crm_non_collection_profiles',
      'FK_owner_id '
    );
    await queryRunner.dropForeignKey(
      'crm_non_collection_profiles',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'crm_non_collection_profiles',
      'FK_tenant_id'
    );

    await queryRunner.dropTable('crm_non_collection_profiles');
  }
}
