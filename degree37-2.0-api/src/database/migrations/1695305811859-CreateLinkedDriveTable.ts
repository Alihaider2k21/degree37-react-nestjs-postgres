import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateLinkedDrivesTable1695305811859
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'linked_drives',
        columns: [
          {
            isPrimary: true,
            name: 'current_drive_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            isPrimary: true,
            name: 'prospective_drive_id',
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
      'linked_drives',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'linked_drives',
      new TableForeignKey({
        columnNames: ['current_drive_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'linked_drives',
      new TableForeignKey({
        columnNames: ['prospective_drive_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('linked_drives', 'created_by');
    await queryRunner.dropForeignKey('linked_drives', 'current_drive_id');
    await queryRunner.dropForeignKey('linked_drives', 'prospective_drive_id');
    // Then, drop the table
    await queryRunner.dropTable('linked_drives');
  }
}
