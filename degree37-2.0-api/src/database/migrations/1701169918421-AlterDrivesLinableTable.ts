import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDrivesLinableTable1701169918421
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'drives',
      new TableColumn({
        name: 'is_linked',
        type: 'boolean',
        default: false,
      })
    );

    await queryRunner.addColumn(
      'drives',
      new TableColumn({
        name: 'is_linkable',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('drives', 'is_linkable');
    await queryRunner.dropColumn('drives', 'is_linked');
  }
}
