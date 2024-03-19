import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterRolesTableAddAutoCreatedColumn1701513773530
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('roles', 'is_auto_created'))) {
      await queryRunner.addColumn(
        'roles',
        new TableColumn({
          name: 'is_auto_created',
          type: 'boolean',
          default: false,
          isNullable: false,
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('roles', 'is_auto_created')) {
      await queryRunner.dropColumn('roles', 'is_auto_created');
    }
  }
}
