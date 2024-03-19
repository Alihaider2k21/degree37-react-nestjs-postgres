import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEquipmentsCollectionOperationTable1694705597140
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'equipments_collection_operations',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
          {
            name: 'equipment_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'collection_operation_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'equipments_collection_operations',
      new TableForeignKey({
        columnNames: ['equipment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'equipments',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'equipments_collection_operations',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'equipments_collection_operations',
      new TableForeignKey({
        columnNames: ['collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey(
      'equipments_collection_operations',
      'FK_equipment_id'
    );
    await queryRunner.dropForeignKey(
      'equipments_collection_operations',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'equipments_collection_operations',
      'FK_collection_operation_id'
    );

    // Drop the table
    await queryRunner.dropTable('equipments_collection_operations');
  }
}
