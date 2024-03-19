import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAffiliationHistory1693934217459
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the affiliation_history table
    await queryRunner.createTable(
      new Table({
        name: 'affiliation_history',
        columns: [
          {
            name: 'rowkey',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'history_reason',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'affiliation_id',
            type: 'bigint',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'collection_operation_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'bigint',
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
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the affiliation_history table
    await queryRunner.dropTable('affiliation_history');
  }
}
