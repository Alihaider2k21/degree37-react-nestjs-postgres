import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveColumnNameSessionsTable1699022434147
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('sessions', 'name')) {
      await queryRunner.dropColumn('sessions', 'name');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('sessions', 'name'))) {
      await queryRunner.addColumn(
        'sessions',
        new TableColumn({
          name: 'name',
          type: 'varchar',
          length: '60',
          isNullable: true,
        })
      );
    }
  }
}
