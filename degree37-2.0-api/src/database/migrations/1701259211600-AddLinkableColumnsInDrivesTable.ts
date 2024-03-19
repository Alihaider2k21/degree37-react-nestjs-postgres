import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLinkableColumnsInDrivesTable1701259211600
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('drives', 'is_linked')))
      await queryRunner.addColumn(
        'drives',
        new TableColumn({
          name: 'is_linked',
          type: 'boolean',
          default: false,
        })
      );
    if (!(await queryRunner.hasColumn('drives', 'is_linkable')))
      await queryRunner.addColumn(
        'drives',
        new TableColumn({
          name: 'is_linkable',
          type: 'boolean',
          default: true,
        })
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('drives', 'is_linked'))
      await queryRunner.dropColumn('drives', 'is_linked');
    if (await queryRunner.hasColumn('drives', 'is_linkable'))
      await queryRunner.dropColumn('drives', 'is_linkable');
  }
}
