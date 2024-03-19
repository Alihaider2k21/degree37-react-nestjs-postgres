import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAllHierarchyAccessToUser1701204745591
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'all_hierarchy_access',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'all_hierarchy_access');
  }
}
