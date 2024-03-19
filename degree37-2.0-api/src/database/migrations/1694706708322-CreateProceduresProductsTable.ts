import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateProceduresProducts1694706708322
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'procedures_products',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'procedures_id',
          type: 'bigint',
          isPrimary: true,
        },
        {
          name: 'product_id',
          type: 'bigint',
          isPrimary: true,
        },
        {
          name: 'quantity',
          type: 'float',
          isNullable: true,
          default: `'0'::double precision`,
        },
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.createForeignKey(
      'procedures_products',
      new TableForeignKey({
        columnNames: ['procedures_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'procedures_products',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createIndex(
      'procedures_products',
      new TableIndex({
        columnNames: ['procedures_id'],
      })
    );

    await queryRunner.createIndex(
      'procedures_products',
      new TableIndex({
        columnNames: ['product_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('procedures_products', 'FK_procedures_id');
    await queryRunner.dropForeignKey('procedures_products', 'FK_product_id');
    // Drop the table
    await queryRunner.dropTable('procedures_products');
  }
}
