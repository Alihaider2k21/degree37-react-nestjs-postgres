import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateQualificationsTable1695716236769
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'qualifications',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'location_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'qualified_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'qualification_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'qualification_expires',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'qualification_status',
            type: 'boolean',
            default: true,
          },
          {
            name: 'attachment_files',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'qualifications',
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
    await queryRunner.dropForeignKey('qualifications', 'FK_created_by');

    await queryRunner.dropTable('qualifications');
  }
}
