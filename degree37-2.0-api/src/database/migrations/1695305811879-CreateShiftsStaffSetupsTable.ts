import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
export class CreateShiftsStaffSetupsTable1695305811879
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shifts_staff_setups',
        columns: [
          {
            name: 'shift_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'staff_setup_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'shifts_staff_setups',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts_staff_setups',
      new TableForeignKey({
        columnNames: ['shift_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shifts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts_staff_setups',
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
    await queryRunner.dropForeignKey('shifts_staff_setups', 'created_by');
    await queryRunner.dropForeignKey('shifts_staff_setups', 'shift_id');
    await queryRunner.dropForeignKey('shifts_staff_setups', 'staff_setup_id');
    // Then, drop the table
    await queryRunner.dropTable('shifts_staff_setups');
  }
}
