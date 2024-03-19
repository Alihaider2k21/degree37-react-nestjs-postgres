import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDrivesTable1697839852307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('drives', [
      new TableColumn({
        name: 'marketing_start_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'marketing_end_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'marketing_start_time',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'marketing_end_time',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'donor_information',
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'instructional_information',
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'online_scheduling_allowed',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'order_due_date',
        type: 'date',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('drives', [
      new TableColumn({
        name: 'marketing_start_date',
        type: 'date',
        isNullable: false,
      }),
      new TableColumn({
        name: 'marketing_end_date',
        type: 'date',
        isNullable: false,
      }),
      new TableColumn({
        name: 'marketing_start_time',
        type: 'date',
        isNullable: false,
      }),
      new TableColumn({
        name: 'marketing_end_time',
        type: 'date',
        isNullable: false,
      }),
      new TableColumn({
        name: 'donor_information',
        type: 'text',
        isNullable: false,
      }),
      new TableColumn({
        name: 'instructional_information',
        type: 'text',
        isNullable: false,
      }),
      new TableColumn({
        name: 'online_scheduling_allowed',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'order_due_date',
        type: 'date',
        isNullable: false,
      }),
    ]);
  }
}
