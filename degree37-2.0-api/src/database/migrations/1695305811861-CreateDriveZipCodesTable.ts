import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

export class CreateDriveZipCodesTable1695305811861
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drives_zipcodes',
        columns: [
          ...genericColumns,
          {
            name: 'drive_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '10',
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'drives_zipcodes',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'drives_zipcodes',
      new TableForeignKey({
        columnNames: ['drive_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drives',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('drives_zipcodes', 'created_by');
    await queryRunner.dropForeignKey('drives_zipcodes', 'drive_id');
    // Then, drop the table
    await queryRunner.dropTable('drives_zipcodes');
  }
}
