import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProductsHistory1693934191829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'products_history',
      columns: [
        {
          name: 'rowKey',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'history_reason',
          type: 'varchar',
          length: '1',
          isNullable: false,
        },
        {
          name: 'name',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'short_description',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'description',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'is_active',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'external_reference',
          type: 'varchar',
          length: '60',
          isNullable: true,
        },
        {
          name: 'tenant_id',
          type: 'bigint',
          isNullable: false,
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
    });

    await queryRunner.createTable(table, true);

    await queryRunner.createForeignKey(
      'products_history',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('products_history', 'FK_created_by');
    // Drop the table
    await queryRunner.dropTable('products_history');
  }
}
