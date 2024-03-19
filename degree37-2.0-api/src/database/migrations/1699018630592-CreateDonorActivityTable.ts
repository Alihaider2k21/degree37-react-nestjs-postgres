import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

enum resourceTypeEnum {
  DONOR = 'donor',
  STAFF = 'staff',
  VOLUNTEER = 'volunteer',
}

export class CreateDonorActivityTable1699018630592
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donors_activities',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'resource_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'resource_type',
            type: 'enum',
            enum: Object.values(resourceTypeEnum),
          },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'reference',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'activity',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'activity_at',
            type: 'timestamp',
            precision: 6,
          },

          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'donors_activities',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_created_by',
      })
    );
    await queryRunner.createForeignKey(
      'donors_activities',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        name: 'FK_tenant_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('donors_activities', 'FK_created_by');
    await queryRunner.dropForeignKey('donors_activities', 'FK_tenant_id');

    await queryRunner.dropTable('donors_activities');
  }
}
