import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class TeamCollectionOperationsTable1694700351363
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'team_collection_operations',
        columns: [
          { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true },
          { name: 'team_id', type: 'integer', isNullable: false },
          {
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'team_collection_operations',
      new TableForeignKey({
        columnNames: ['team_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'team',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'team_collection_operations',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'team_collection_operations',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'team_collection_operations',
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
    await queryRunner.dropForeignKey(
      'team_collection_operations',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'team_collection_operations',
      'FK_tenant_id'
    );
    await queryRunner.dropForeignKey(
      'team_collection_operations',
      'FK_team_id'
    );
    await queryRunner.dropForeignKey(
      'team_collection_operations',
      'FK_collection_operation_id'
    );

    await queryRunner.dropTable('team_collection_operations');
  }
}
