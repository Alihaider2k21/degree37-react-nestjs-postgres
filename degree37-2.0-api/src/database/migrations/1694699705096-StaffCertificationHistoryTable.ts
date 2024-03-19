import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class StaffCertificationHistoryTable1694699705096
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_certification_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          {
            name: 'history_reason',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          {
            name: 'staff_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'certificate_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'certificate_start_date',
            type: 'date',
            isNullable: false,
          },
          { name: 'is_archived', type: 'boolean', default: false },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'staff_certification_history',
      new TableForeignKey({
        columnNames: ['staff_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_certification_history',
      new TableForeignKey({
        columnNames: ['certificate_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'certification',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'staff_certification_history',
      'FK_certificate_id'
    );
    await queryRunner.dropForeignKey(
      'staff_certification_history',
      'FK_staff_id'
    );
    // Drop the table
    await queryRunner.dropTable('staff_certification_history');
  }
}
