import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export enum ApprovalStatusEnum {
  APPROVED = 'approved', //default
  PENDING = 'pending',
  REJECTED = 'rejected',
  REQUIRESAPPROVAL = 'requires_approval',
}

export class AlterOcNonCollectionEventsTable1698135825172
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('oc_non_collection_events', 'name');

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'date',
        type: 'date',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'event_name',
        type: 'varchar',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'owner_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'non_collection_profile_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'location_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'collection_operation_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'status_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'event_category_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'event_subcategory_id',
        type: 'bigint',
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'oc_non_collection_events',
      new TableColumn({
        name: 'approval_status',
        type: 'enum',
        enum: Object.values(ApprovalStatusEnum),
        default: `'approved'`,
        isNullable: false,
      })
    );

    await queryRunner.createForeignKey(
      'oc_non_collection_events',
      new TableForeignKey({
        columnNames: ['non_collection_profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_non_collection_profiles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_non_collection_profile_id',
      })
    );

    await queryRunner.createForeignKey(
      'oc_non_collection_events',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_locations',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_location_id',
      })
    );

    await queryRunner.createForeignKey(
      'oc_non_collection_events',
      new TableForeignKey({
        columnNames: ['collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_collection_operation_id',
      })
    );

    await queryRunner.createForeignKey(
      'oc_non_collection_events',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_tenant_id',
      })
    );

    await queryRunner.createForeignKey(
      'oc_non_collection_events',
      new TableForeignKey({
        columnNames: ['status_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operations_status',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_operations_status_id',
      })
    );

    await queryRunner.createForeignKey(
      'oc_non_collection_events',
      new TableForeignKey({
        columnNames: ['event_subcategory_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_event_subcategory_id',
      })
    );

    await queryRunner.createForeignKey(
      'oc_non_collection_events',
      new TableForeignKey({
        columnNames: ['event_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_event_category_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('oc_non_collection_events', 'date');
    await queryRunner.dropColumn('oc_non_collection_events', 'event_name');
    await queryRunner.dropColumn('oc_non_collection_events', 'owner_id');

    await queryRunner.dropColumn(
      'oc_non_collection_events',
      'non_collection_profile_id'
    );
    await queryRunner.dropColumn('oc_non_collection_events', 'location_id');
    await queryRunner.dropColumn(
      'oc_non_collection_events',
      'collection_operation_id'
    );
    await queryRunner.dropColumn('oc_non_collection_events', 'status_id');
    await queryRunner.dropColumn(
      'oc_non_collection_events',
      'event_category_id'
    );
    await queryRunner.dropColumn(
      'oc_non_collection_events',
      'event_subcategory_id'
    );
    await queryRunner.dropColumn('oc_non_collection_events', 'tenant_id');

    await queryRunner.dropColumn('oc_non_collection_events', 'approval_status');

    await queryRunner.dropColumn(
      'oc_non_collection_events',
      'FK_non_collection_profile_id'
    );

    await queryRunner.dropForeignKey(
      'oc_non_collection_events',
      'FK_operations_status_id'
    );
    await queryRunner.dropForeignKey(
      'oc_non_collection_events',
      'FK_event_subcategory_id'
    );
    await queryRunner.dropForeignKey(
      'oc_non_collection_events',
      'FK_event_category_id'
    );

    await queryRunner.dropForeignKey(
      'oc_non_collection_events',
      'FK_collection_operation_id'
    );

    await queryRunner.dropForeignKey(
      'oc_non_collection_events',
      'FK_location_id'
    );
  }
}
