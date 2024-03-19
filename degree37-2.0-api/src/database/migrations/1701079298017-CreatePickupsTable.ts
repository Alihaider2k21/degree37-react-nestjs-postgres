import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePickupsTable1701079298017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'pickups',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'description',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'pickable_id',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'equipment_id',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'start_time',
          type: 'timestamp',
          isNullable: false,
        },
        {
          name: 'pickable_type',
          type: 'int',
          isNullable: false,
        },
        {
          name: 'is_archived',
          type: 'boolean',
          default: false,
          isNullable: false,
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
    });

    await queryRunner.createTable(table, true);

    await queryRunner.createForeignKey(
      'pickups',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_created_by',
      })
    );

    await queryRunner.createForeignKey(
      'pickups',
      new TableForeignKey({
        columnNames: ['equipment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'equipments',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_equipment_id',
      })
    );

    await queryRunner.createForeignKey(
      'pickups',
      new TableForeignKey({
        columnNames: ['pickable_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_pickable_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('pickups', 'FK_created_by');
    await queryRunner.dropForeignKey('pickups', 'FK_equipment_id');
    await queryRunner.dropForeignKey('pickups', 'FK_pickable_id');

    // Drop the table
    await queryRunner.dropTable('pickups');
  }
}
