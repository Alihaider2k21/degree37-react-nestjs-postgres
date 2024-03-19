import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterTable1695364675980 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'crm_locations',
      new TableForeignKey({
        columnNames: ['site_contact_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crm_volunteer',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
    await queryRunner.createForeignKey(
      'crm_locations_specs',
      new TableForeignKey({
        columnNames: ['room_size_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'room_size',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('crm_locations', 'FK_site_contact_id');
    await queryRunner.dropForeignKey('crm_locations_specs', 'FK_room_size_id');
    // Then, drop the table
    // await queryRunner.dropTable("shifts_devices");
  }
}
