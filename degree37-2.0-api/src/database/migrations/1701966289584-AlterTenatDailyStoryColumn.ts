import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTenantDailyStoryColumn1701966289584
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tenant',
      new TableColumn({
        name: 'dailystory_tenant_uid',
        type: 'text',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'tenant',
      new TableColumn({
        name: 'dailystory_token',
        type: 'text',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'tenant',
      new TableColumn({
        name: 'dailystory_tenant_id',
        type: 'text',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'tenant',
      new TableColumn({
        name: 'dailystory_funnel_uuid',
        type: 'text',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'tenant',
      new TableColumn({
        name: 'dailystory_mobile_key',
        type: 'varchar[]',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'tenant',
      new TableColumn({
        name: 'tenant_secret_key',
        type: 'text',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'tenant',
      new TableColumn({
        name: 'dailystory_campaign_id',
        type: 'text',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tenant', 'dailystory_tenant_uid');
    await queryRunner.dropColumn('tenant', 'dailystory_token');
    await queryRunner.dropColumn('tenant', 'dailystory_tenant_id');
    await queryRunner.dropColumn('tenant', 'dailystory_funnel_uuid');
    await queryRunner.dropColumn('tenant', 'dailystory_mobile_key');
    await queryRunner.dropColumn('tenant', 'dailystory_campaign_id');
  }
}
