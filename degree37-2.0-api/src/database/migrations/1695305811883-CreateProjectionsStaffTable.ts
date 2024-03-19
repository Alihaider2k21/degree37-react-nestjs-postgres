import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateProjectionsStaffTable1695305811883
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shifts_projetions_staff',
        columns: [
          ...genericColumns,
          {
            name: 'shift_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'procedure_type_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'staff_setup_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'product_yield',
            type: 'int',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'shifts_projetions_staff',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts_projetions_staff',
      new TableForeignKey({
        columnNames: ['shift_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shifts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts_projetions_staff',
      new TableForeignKey({
        columnNames: ['procedure_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure_types',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts_projetions_staff',
      new TableForeignKey({
        columnNames: ['staff_setup_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff_setup',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('shifts_projetions_staff', 'created_by');
    await queryRunner.dropForeignKey('shifts_projetions_staff', 'shift_id');
    await queryRunner.dropForeignKey(
      'shifts_projetions_staff',
      'procedure_type_id'
    );
    await queryRunner.dropForeignKey(
      'shifts_projetions_staff',
      'staff_setup_id'
    );
    // Then, drop the table
    await queryRunner.dropTable('shifts_projetions_staff');
  }
}
