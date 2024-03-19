// import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

// export class AddAllHierarchyAccessToUserHistory1701886050952
//   implements MigrationInterface
// {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.addColumn(
//       'user_history',
//       new TableColumn({
//         name: 'all_hierarchy_access',
//         type: 'boolean',
//         default: false,
//       })
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropColumn('user_history', 'all_hierarchy_access');
//   }
// }
