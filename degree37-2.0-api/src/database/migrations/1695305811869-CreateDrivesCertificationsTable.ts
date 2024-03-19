import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class DriveCertificationsTable1695305811869
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drive_certifications',
        columns: [
          {
            name: 'drive_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            isPrimary: true,
            name: 'certification_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
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
      })
    );

    await queryRunner.createForeignKey(
      'drive_certifications',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drive_certifications',
      new TableForeignKey({
        columnNames: ['drive_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drive_certifications',
      new TableForeignKey({
        columnNames: ['certification_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'certification',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('drive_certifications', 'created_by');
    await queryRunner.dropForeignKey('drive_certifications', 'drive_id');
    await queryRunner.dropForeignKey(
      'drive_certifications',
      'certification_id'
    );
    // Then, drop the table
    await queryRunner.dropTable('drive_certifications');
  }
}
