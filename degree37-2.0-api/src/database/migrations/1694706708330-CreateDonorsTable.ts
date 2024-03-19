import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateDonorsTable1694706708330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the donors table
    await queryRunner.createTable(
      new Table({
        name: 'donors',
        columns: [
          ...genericColumns,
          {
            name: 'external_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'prefix_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'suffix_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'birth_date',
            type: 'timestamp',
            precision: 6,
            isNullable: false,
          },
          {
            name: 'nick_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'blood_type',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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
      'donors',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'donors',
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
    await queryRunner.dropForeignKey('donors', 'FK_tenant_id');
    await queryRunner.dropForeignKey('donors', 'FK_created_by');
    // Then, drop the table
    await queryRunner.dropTable('donors');
  }
}
