import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateDriveTable1695305811857 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drives',
        columns: [
          ...genericColumns,
          {
            name: 'name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'account_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'location_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'is_multi_day_drive',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'promotion_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'operation_status_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'recruiter_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'drives',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_locations',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives',
      new TableForeignKey({
        columnNames: ['promotion_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'promotion_entity',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives',
      new TableForeignKey({
        columnNames: ['operation_status_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operations_status',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives',
      new TableForeignKey({
        columnNames: ['recruiter_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('drives', 'created_by');
    await queryRunner.dropForeignKey('drives', 'account_id');
    await queryRunner.dropForeignKey('drives', 'location_id');
    await queryRunner.dropForeignKey('drives', 'tenant_id');
    await queryRunner.dropForeignKey('drives', 'promotion_id');
    await queryRunner.dropForeignKey('drives', 'operation_status_id');
    await queryRunner.dropForeignKey('drives', 'recruiter_id');
    // Then, drop the table
    await queryRunner.dropTable('drives');
  }
}
