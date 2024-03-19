import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateStaffDonorCentersMappingTable1695717727514
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the staff_donor_centers_mapping table
    await queryRunner.createTable(
      new Table({
        name: 'staff_donor_centers_mapping',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_primary',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'staff_id',
            type: 'bigint',
          },
          {
            name: 'donor_center_id',
            type: 'bigint',
          },
        ],
      })
    );
    await queryRunner.createForeignKey(
      'staff_donor_centers_mapping',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'staff_donor_centers_mapping',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'staff_donor_centers_mapping',
      new TableForeignKey({
        columnNames: ['staff_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'staff_donor_centers_mapping',
      new TableForeignKey({
        columnNames: ['donor_center_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'facility',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'staff_donor_centers_mapping',
      'FK_created_by'
    );
    await queryRunner.dropForeignKey(
      'staff_donor_centers_mapping',
      'FK_tenant_id'
    );
    await queryRunner.dropForeignKey(
      'staff_donor_centers_mapping',
      'FK_staff_id'
    );
    await queryRunner.dropForeignKey(
      'staff_donor_centers_mapping',
      'FK_donor_center_id'
    );
    // Drop the staff table
    await queryRunner.dropTable('staff_donor_centers_mapping');
  }
}
