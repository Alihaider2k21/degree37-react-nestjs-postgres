import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class StaffCertificationTable1694699673546
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_certification',
        columns: [
          ...genericColumns,
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
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'staff_certification',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    // Define foreign key constraint

    await queryRunner.createForeignKey(
      'staff_certification',
      new TableForeignKey({
        columnNames: ['staff_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_certification',
      new TableForeignKey({
        columnNames: ['certificate_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'certification',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_certification',
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
    // Drop the foreign key constraints
    await queryRunner.dropForeignKey('staff_certification', 'FK_created_by');
    await queryRunner.dropForeignKey('staff_certification', 'FK_tenant_id');
    await queryRunner.dropForeignKey(
      'staff_certification',
      'FK_certificate_id'
    );
    await queryRunner.dropForeignKey('staff_certification', 'FK_staff_id');

    // Drop the table
    await queryRunner.dropTable('staff_certification');
  }
}
