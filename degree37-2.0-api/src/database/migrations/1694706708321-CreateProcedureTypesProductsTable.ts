import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateProcedureTypesProducts1694706708321
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'procedure_types_products',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'procedure_type_id',
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
      'procedure_types_products',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'procedure_types_products',
      new TableForeignKey({
        columnNames: ['procedure_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure_types',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createIndex(
      'procedure_types_products',
      new TableIndex({
        columnNames: ['procedure_type_id'],
      })
    );

    await queryRunner.createIndex(
      'procedure_types_products',
      new TableIndex({
        columnNames: ['product_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign keys first
    await queryRunner.dropForeignKey(
      'procedure_types_products',
      'FK_procedure_type_id'
    );
    await queryRunner.dropForeignKey(
      'procedure_types_products',
      'FK_product_id'
    );
    // Drop the table
    await queryRunner.dropTable('procedure_types_products');
  }
}
