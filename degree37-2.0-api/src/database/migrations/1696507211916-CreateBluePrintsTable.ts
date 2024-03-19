import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateBluePrintsTable1696507211916 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm_ncp_blueprints',
        columns: [
          ...genericColumns,
          {
            name: 'crm_non_collection_profiles_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'blueprint_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'location_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'additional_info',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'id_default',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'crm_ncp_blueprints',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_ncp_blueprints',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_ncp_blueprints',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_locations',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'crm_ncp_blueprints',
      new TableForeignKey({
        columnNames: ['crm_non_collection_profiles_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_non_collection_profiles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('crm_ncp_blueprints', 'FK_tenant_id');
    await queryRunner.dropForeignKey('crm_ncp_blueprints', 'FK_created_by');
    await queryRunner.dropForeignKey('crm_ncp_blueprints', 'FK_location_id');
    await queryRunner.dropForeignKey(
      'crm_ncp_blueprints',
      'FK_crm_non_collection_profiles_id'
    );

    await queryRunner.dropTable('crm_ncp_blueprints');
  }
}
