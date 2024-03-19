import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from 'typeorm';
export class AlterTableCrmVolunteerTableAddRelation1695387702370
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('crm_volunteer', 'prefix_id');
    await queryRunner.dropColumn('crm_volunteer', 'suffix_id');

    await queryRunner.addColumn(
      'crm_volunteer',
      new TableColumn({
        name: 'prefix_id',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'crm_volunteer',
      new TableColumn({
        name: 'suffix_id',
        type: 'bigint',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'crm_volunteer',
      new TableForeignKey({
        columnNames: ['prefix_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'prefixes',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'crm_volunteer',
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
    await queryRunner.dropForeignKey('crm_volunteer', 'FK_prefix_id');
    await queryRunner.dropForeignKey('crm_volunteer', 'FK_suffix_id');
    await queryRunner.addColumn(
      'crm_volunteer',

      new TableColumn({
        name: 'prefix_id',
        type: 'integer',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'crm_volunteer',

      new TableColumn({
        name: 'suffix_id',
        type: 'integer',
        isNullable: true,
      })
    );
  }
}
