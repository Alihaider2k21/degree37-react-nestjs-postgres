import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStaffConfigTable1693934264622 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staff_config',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'qty',
            type: 'int',
          },
          {
            name: 'lead_time',
            type: 'int',
          },
          {
            name: 'setup_time',
            type: 'int',
          },
          {
            name: 'breakdown_time',
            type: 'int',
          },
          {
            name: 'wrapup_time',
            type: 'int',
          },
          {
            name: 'staff_setup_id',
            type: 'bigint',
          },
          {
            name: 'role_id',
            type: 'bigint',
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
      'staff_config',
      new TableForeignKey({
        columnNames: ['staff_setup_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff_setup',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_config',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_config',
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
    await queryRunner.dropForeignKey('staff_config', 'FK_staff_setup_id');
    await queryRunner.dropForeignKey('staff_config', 'FK_role_id');
    await queryRunner.dropForeignKey('staff_config', 'FK_tenant_id');

    await queryRunner.dropTable('staff_config');
  }
}
