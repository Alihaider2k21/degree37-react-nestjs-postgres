import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AlterTableLocationDirections1696431877765
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the table
    await queryRunner.dropTable('location_directions');

    await queryRunner.createTable(
      new Table({
        name: 'location_directions',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
          { name: 'location_id', type: 'bigint', isNullable: true },
          { name: 'direction', type: 'varchar', length: '100' },
          { name: 'miles', type: 'float' },
          { name: 'minutes', type: 'float' },
          { name: 'is_archived', type: 'boolean', default: false },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'location_directions',
      new TableForeignKey({
        columnNames: ['collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'location_directions',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'location_directions',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_locations',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'location_directions',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'location_directions',
      'FK_collection_operation_id'
    );
    await queryRunner.dropForeignKey('location_directions', 'FK_location_id');
    await queryRunner.dropForeignKey('location_directions', 'FK_created_by');
    await queryRunner.dropForeignKey('location_directions', 'FK_tenant_id');

    await queryRunner.dropTable('location_directions');
  }
}
