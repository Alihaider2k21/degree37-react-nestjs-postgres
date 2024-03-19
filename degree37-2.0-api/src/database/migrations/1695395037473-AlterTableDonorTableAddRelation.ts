import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterTableDonorTableAddRelation1695395037473
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('donors', 'prefix_id');
    await queryRunner.dropColumn('donors', 'suffix_id');

    await queryRunner.addColumn(
      'donors',
      new TableColumn({
        name: 'prefix_id',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'donors',
      new TableColumn({
        name: 'suffix_id',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'donors',
      new TableForeignKey({
        columnNames: ['prefix_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'prefixes',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'donors',
      new TableForeignKey({
        columnNames: ['suffix_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'suffixes',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('donors', 'FK_prefix_id');
    await queryRunner.dropForeignKey('donors', 'FK_suffix_id');
    await queryRunner.addColumn(
      'donors',

      new TableColumn({
        name: 'prefix_id',
        type: 'integer',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'donors',

      new TableColumn({
        name: 'suffix_id',
        type: 'integer',
        isNullable: true,
      })
    );
  }
}
