import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDriveEquipmentsTable1695305811865
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drive_equipments',
        columns: [
          {
            name: 'drive_id',
            type: 'bigint',
            isPrimary: true,
            isNullable: false,
          },
          {
            isPrimary: true,
            name: 'equipment_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
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
      'drive_equipments',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drive_equipments',
      new TableForeignKey({
        columnNames: ['drive_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drive_equipments',
      new TableForeignKey({
        columnNames: ['equipment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'equipments',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('drive_equipments', 'created_by');
    await queryRunner.dropForeignKey('drive_equipments', 'drive_id');
    await queryRunner.dropForeignKey('drive_equipments', 'equipment_id');
    // Then, drop the table
    await queryRunner.dropTable('drive_equipments');
  }
}
