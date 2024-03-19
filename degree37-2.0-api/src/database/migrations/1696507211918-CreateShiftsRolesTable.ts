import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateShiftsRolesTable1696507211918 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shifts_roles',
        columns: [
          {
            name: 'shift_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'role_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
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
      'shifts_roles',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts_roles',
      new TableForeignKey({
        columnNames: ['shift_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shifts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'shifts_roles',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contacts_roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('shifts_roles', 'created_by');
    await queryRunner.dropForeignKey('shifts_roles', 'shift_id');
    await queryRunner.dropForeignKey('shifts_roles', 'vehicle_id');
    // Then, drop the table
    await queryRunner.dropTable('shifts_roles');
  }
}
