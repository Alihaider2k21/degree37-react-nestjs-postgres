import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateShiftsSlotsTable1695305811881 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shifts_slots',
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
            name: 'start_time',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_time',
            type: 'date',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'shifts_slots',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts_slots',
      new TableForeignKey({
        columnNames: ['shift_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shifts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts_slots',
      new TableForeignKey({
        columnNames: ['procedure_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'procedure_types',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('shifts_slots', 'created_by');
    await queryRunner.dropForeignKey('shifts_slots', 'shift_id');
    await queryRunner.dropForeignKey('shifts_slots', 'procedure_type_id');
    // Then, drop the table
    await queryRunner.dropTable('shifts_slots');
  }
}
