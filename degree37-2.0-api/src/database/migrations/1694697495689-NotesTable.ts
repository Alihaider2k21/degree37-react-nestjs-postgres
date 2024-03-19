import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class NotesTable1694697495689 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the Notes table
    await queryRunner.createTable(
      new Table({
        name: 'notes',
        columns: [
          ...genericColumns,
          { name: 'noteable_id', type: 'bigint', isNullable: true },
          {
            name: 'noteable_type',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'note_name',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          { name: 'details', type: 'text', isNullable: true },
          { name: 'category_id', type: 'bigint', isNullable: true },
          { name: 'sub_category_id', type: 'bigint', isNullable: true },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: true,
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
      'notes',
      new TableForeignKey({
        columnNames: ['sub_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'notes',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'notes',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'notes',
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
    await queryRunner.dropForeignKey('notes', 'FK_sub_category_id');
    await queryRunner.dropForeignKey('notes', 'FK_tenant_id');
    await queryRunner.dropForeignKey('notes', 'FK_category_id');
    await queryRunner.dropForeignKey('notes', 'FK_created_by');

    // Drop the Notes table
    await queryRunner.dropTable('notes');
  }
}
