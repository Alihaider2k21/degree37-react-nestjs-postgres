import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDonorGroupCodesTable1698852847903
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ContactPreferencesHistory table
    await queryRunner.createTable(
      new Table({
        name: 'donor_group_codes',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'donor_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'group_code_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'donor_group_codes',
      new TableForeignKey({
        columnNames: ['donor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'donors',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'donor_group_codes',
      new TableForeignKey({
        columnNames: ['group_code_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //Drop Foreign Key Constraints
    await queryRunner.dropForeignKey('donor_group_codes', 'FK_donor_id');
    await queryRunner.dropForeignKey('donor_group_codes', 'FK_group_code_id');

    // Drop the ContactPreferencesHistory table
    await queryRunner.dropTable('donor_group_codes');
  }
}
