import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class DonorCenterFilterTable1694700047790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the tasks table
    await queryRunner.createTable(
      new Table({
        name: 'donor_center_filter',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'city', type: 'varchar', isNullable: false },
          { name: 'state', type: 'varchar', isNullable: false },
          { name: 'is_active', type: 'boolean', default: false },
          { name: 'staging_site', type: 'boolean', default: false },
          { name: 'collection_operation', type: 'bigint', isNullable: false },
          { name: 'organizational_level', type: 'bigint', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'donor_center_filter',
      new TableForeignKey({
        columnNames: ['collection_operation'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'donor_center_filter',
      new TableForeignKey({
        columnNames: ['organizational_level'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizational_levels',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'donor_center_filter',
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
    await queryRunner.dropForeignKey(
      'donor_center_filter',
      'FK_collection_operation'
    );
    await queryRunner.dropForeignKey(
      'donor_center_filter',
      'FK_organizational_level'
    );
    await queryRunner.dropForeignKey('donor_center_filter', 'FK_created_by');
    // Drop the tasks table
    await queryRunner.dropTable('donor_center_filter');
  }
}
