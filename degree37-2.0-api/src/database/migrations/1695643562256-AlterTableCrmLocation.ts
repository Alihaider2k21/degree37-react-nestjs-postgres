import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export class AlterTableCrmLocationAddColumn1695643562256
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'crm_locations',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: false,
      })
    );
    await queryRunner.addColumn(
      'crm_locations_specs',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: false,
      })
    );
    await queryRunner.addColumn(
      'crm_locations_specs_options',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: false,
      })
    );
    await queryRunner.createForeignKey(
      'crm_locations',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'crm_locations_specs',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'crm_locations_specs_options',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.addColumn(
      'crm_locations_history',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: false,
      })
    );
    await queryRunner.addColumn(
      'crm_locations_specs_history',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: false,
      })
    );
    await queryRunner.addColumn(
      'crm_locations_specs_options_history',
      new TableColumn({
        name: 'tenant_id',
        type: 'bigint',
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('crm_locations', 'FK_site_contact_id');
    await queryRunner.dropForeignKey('crm_locations_specs', 'FK_room_size_id');
    // Then, drop the table
    // await queryRunner.dropTable("shifts_devices");
  }
}
