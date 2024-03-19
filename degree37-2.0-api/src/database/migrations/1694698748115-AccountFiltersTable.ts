import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AccountFiltersTable1694698748115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the account_filters table
    await queryRunner.createTable(
      new Table({
        name: 'account_filters',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '60', isNullable: false },
          { name: 'city', type: 'varchar', length: '60', isNullable: true },
          { name: 'state', type: 'varchar', length: '60', isNullable: true },
          { name: 'industry_category', type: 'bigint', isNullable: true },
          { name: 'industry_subcategory', type: 'bigint', isNullable: true },
          { name: 'organizational_level', type: 'bigint', isNullable: true },
          { name: 'recruiter', type: 'bigint', isNullable: true },
          { name: 'collection_operation', type: 'bigint', isNullable: true },
          { name: 'is_active', type: 'boolean', isNullable: true },
          { name: 'stage', type: 'bigint', isNullable: true },
          { name: 'source', type: 'bigint', isNullable: true },
          { name: 'territory', type: 'bigint', isNullable: true },
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
        ],
      })
    );

    // Create foreign key constraints (if necessary)
    await queryRunner.createForeignKey(
      'account_filters',
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
    await queryRunner.dropForeignKey('account_filters', 'FK_created_by');
    // Drop the account_filters table
    await queryRunner.dropTable('account_filters');
  }
}
