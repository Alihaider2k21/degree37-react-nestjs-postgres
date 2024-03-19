import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMenuItemsTable1693934006558 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'menu_items',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'title', type: 'varchar' },
          { name: 'url', type: 'varchar' },
          { name: 'is_protected', type: 'boolean', default: true },
          { name: 'parent_id', type: 'boolean', default: true },
          { name: 'navigation_type', type: 'varchar' },
          { name: 'client_id', type: 'varchar' },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "menu_items" table
    await queryRunner.dropTable('menu_items');
  }
}
