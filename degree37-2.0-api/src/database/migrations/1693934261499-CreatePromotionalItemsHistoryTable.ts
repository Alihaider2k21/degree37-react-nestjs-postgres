import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePromotionalItemsHistoryTable1693934261499
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'promotional_items_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'short_name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'promotion_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'boolean',
            default: false,
          },
          {
            name: 'retire_on',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'collection_operations',
            type: 'bigint',
            isArray: true,
            isNullable: false,
          },
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
          {
            name: 'created_by',
            type: 'bigint',
          },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'promotional_items_history',
      new TableForeignKey({
        columnNames: ['promotion_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'promotion_entity',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'promotional_items_history',
      'FK_promotion_id'
    );

    await queryRunner.dropTable('promotional_items_history');
  }
}
