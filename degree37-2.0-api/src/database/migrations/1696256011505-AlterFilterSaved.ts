import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class AlterFilterSaved1696256011505 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('filter_saved', 'is_predefined');
    await queryRunner.addColumn(
      'filter_saved',
      new TableColumn({
        name: 'is_predefined',
        type: 'boolean',
        default: true,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('filter_saved', 'is_predefined');
  }
}
