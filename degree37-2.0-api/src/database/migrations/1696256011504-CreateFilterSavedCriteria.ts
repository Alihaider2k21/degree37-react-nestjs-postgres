import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateFilterSavedCriteria1696256011504
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'filter_saved_criteria',
        columns: [
          ...genericColumns,
          {
            name: 'filter_saved_value',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'filter_saved_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'filter_criteria_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'filter_saved_criteria',
      new TableForeignKey({
        columnNames: ['filter_saved_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'filter_saved',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'filter_saved_criteria',
      new TableForeignKey({
        columnNames: ['filter_criteria_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'filter_criteria',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'filter_saved_criteria',
      'FK_filter_criteria'
    );
    await queryRunner.dropForeignKey(
      'filter_saved_criteria',
      'FK_filter_saved'
    );
    await queryRunner.dropTable('filter_saved');
  }
}
