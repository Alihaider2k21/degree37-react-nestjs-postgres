import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEquipmentRetiresOnColumn1699542429398
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipments" ALTER COLUMN "retire_on" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipments" ALTER COLUMN "retire_on" SET NOT NULL`
    );
  }
}
