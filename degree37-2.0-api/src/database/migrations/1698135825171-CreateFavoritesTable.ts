import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
export class CreateFavoritesTable1698135825171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'favorites',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'alternate_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'organization_level_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'location_type',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'operation_type',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'preview_in_calendar',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'is_open_in_new_tab',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'is_default',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'procedure_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'operations_status_id',
            type: 'bigint',
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'favorites',
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
      'favorites',
      new TableForeignKey({
        columnNames: ['organization_level_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizational_levels',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_organization_level_id',
      })
    );

    await queryRunner.createForeignKey(
      'favorites',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_created_by',
      })
    );
    await queryRunner.createForeignKey(
      'favorites',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_product_id',
      })
    );

    await queryRunner.createForeignKey(
      'favorites',
      new TableForeignKey({
        columnNames: ['procedure_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_procedure_id',
      })
    );

    await queryRunner.createForeignKey(
      'favorites',
      new TableForeignKey({
        columnNames: ['operations_status_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operations_status',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_operations_status_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('favorites', 'FK_tenant_id');
    await queryRunner.dropForeignKey('favorites', 'FK_organization_level_id');
    await queryRunner.dropForeignKey('favorites', 'FK_created_by');
    await queryRunner.dropForeignKey('favorites', 'FK_product_id');
    await queryRunner.dropForeignKey('favorites', 'FK_procedure_id');
    await queryRunner.dropForeignKey('favorites', 'FK_operations_status_id');
    await queryRunner.dropTable('favorites');
  }
}
