import { QueryRunner } from 'typeorm';

export const dropTables = async (
  queryRunner: QueryRunner,
  ...tables: string[]
) => {
  for (const table_name of tables) {
    if (await queryRunner.hasTable(table_name)) {
      const table = await queryRunner.getTable(table_name);
      await queryRunner.dropForeignKeys(table, table.foreignKeys);
      await queryRunner.dropTable(table);
    }
  }
};
