import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSessionTable1698745929439 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.hasTable('oc_sessions')) {
      await queryRunner.renameTable('oc_sessions', 'sessions');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.hasTable('sessions')) {
      await queryRunner.renameTable('sessions', 'oc_sessions');
    }
  }
}
