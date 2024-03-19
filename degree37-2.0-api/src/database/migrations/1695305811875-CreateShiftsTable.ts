import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateShiftsTable1695305811875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shifts',
        columns: [
          ...genericColumns,
          {
            name: 'shiftable_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'shiftable_type',
            type: 'varchar',
            length: '255',
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
          {
            name: 'break_start_time',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'break_end_time',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'reduction_percentage',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'reduce_slots',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'oef_procedures',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'oef_products',
            type: 'int',
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
      'shifts',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('shifts', 'created_by');
    await queryRunner.dropForeignKey('shifts', 'tenant_id');
    // Then, drop the table
    await queryRunner.dropTable('shifts');
  }
}
