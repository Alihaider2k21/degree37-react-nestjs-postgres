import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDrivesTable1697839852311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('drives', [
      new TableColumn({
        name: 'open_to_public',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'tele_recruitment',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'sms',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'email',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'tele_recruitment_status',
        type: 'varchar',
        length: '60',
        isNullable: true,
      }),
      new TableColumn({
        name: 'sms_status',
        type: 'varchar',
        length: '60',
        isNullable: true,
      }),
      new TableColumn({
        name: 'email_status',
        type: 'varchar',
        length: '60',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('drives', [
      new TableColumn({
        name: 'open_to_public',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'tele_recruitment',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'sms',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'email',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'tele_recruitment_status',
        type: 'varchar',
        length: '60',
        isNullable: true,
      }),
      new TableColumn({
        name: 'sms_status',
        type: 'varchar',
        length: '60',
        isNullable: true,
      }),
      new TableColumn({
        name: 'email_status',
        type: 'varchar',
        length: '60',
        isNullable: true,
      }),
    ]);
  }
}
