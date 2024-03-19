import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEquipmentHistoryRetiresOnColumn1699542438034
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipments_history" ALTER COLUMN "resign_on_date" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipments_history" ALTER COLUMN "resign_on_date" SET NOT NULL`
    );
  }
}
