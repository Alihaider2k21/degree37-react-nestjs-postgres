import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDriveMarketingMaterialItemsTable1695305811863
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drives_marketing_material_items',
        columns: [
          {
            name: 'drive_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            isPrimary: true,
            name: 'marketing_material_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'drives_marketing_material_items',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives_marketing_material_items',
      new TableForeignKey({
        columnNames: ['drive_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives_marketing_material_items',
      new TableForeignKey({
        columnNames: ['marketing_material_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'marketing_materials',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'drives_marketing_material_items',
      'created_by'
    );
    await queryRunner.dropForeignKey(
      'drives_marketing_material_items',
      'drive_id'
    );
    await queryRunner.dropForeignKey(
      'drives_marketing_material_items',
      'marketing_material_id'
    );
    // Then, drop the table
    await queryRunner.dropTable('drives_marketing_material_items');
  }
}
