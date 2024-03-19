import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVehicleCertification1694706708327
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the vehicle_certification table
    await queryRunner.createTable(
      new Table({
        name: 'vehicle_certification',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'vehicle_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'certification_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist
    );

    await queryRunner.createForeignKey(
      'vehicle_certification',
      new TableForeignKey({
        columnNames: ['vehicle_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicle',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle_certification',
      new TableForeignKey({
        columnNames: ['certification_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'certification',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle_certification',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'vehicle_certification',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('vehicle_certification', 'FK_vehicle_id');
    await queryRunner.dropForeignKey(
      'vehicle_certification',
      'FK_certification_id'
    );
    await queryRunner.dropForeignKey('vehicle_certification', 'FK_created_by');
    await queryRunner.dropForeignKey('vehicle_certification', 'FK_tenant_id');
    // Drop the vehicle_certification table
    await queryRunner.dropTable('vehicle_certification');
  }
}
