import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateResourceSharingsFullfilmentTable1702564515619
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'resource_sharings_fulfillment',
        columns: [
          {
            name: 'resource_share_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'share_type_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'resource_sharings_fulfillment',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'resource_sharings_fulfillment',
      new TableForeignKey({
        columnNames: ['resource_share_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'resource_sharings',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'resource_sharings_fulfillment',
      'created_by'
    );
    await queryRunner.dropForeignKey(
      'resource_sharings_fulfillment',
      'resource_share_id'
    );
    // Then, drop the table
    await queryRunner.dropTable('resource_sharings_fulfillment');
  }
}
