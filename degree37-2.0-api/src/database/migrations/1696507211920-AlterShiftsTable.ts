import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftsTable1696507211920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'shifts',
      'reduction_percentage',
      new TableColumn({
        name: 'reduction_percentage',
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'reduce_slots',
      new TableColumn({
        name: 'reduce_slots',
        type: 'boolean',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'oef_procedures',
      new TableColumn({
        name: 'oef_procedures',
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'oef_products',
      new TableColumn({
        name: 'oef_products',
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'start_time',
      new TableColumn({
        name: 'start_time',
        type: 'timestamp',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'end_time',
      new TableColumn({
        name: 'end_time',
        type: 'timestamp',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'break_start_time',
      new TableColumn({
        name: 'break_start_time',
        type: 'timestamp',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'break_end_time',
      new TableColumn({
        name: 'break_end_time',
        type: 'timestamp',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverting the changes, assuming you want non-nullable columns
    // You can adjust this based on your needs
    await queryRunner.changeColumn(
      'shifts',
      'reduction_percentage',
      new TableColumn({
        name: 'reduction_percentage',
        type: 'int',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'reduce_slots',
      new TableColumn({
        name: 'reduce_slots',
        type: 'boolean',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'oef_procedures',
      new TableColumn({
        name: 'oef_procedures',
        type: 'int',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'oef_products',
      new TableColumn({
        name: 'oef_products',
        type: 'int',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'start_time',
      new TableColumn({
        name: 'start_time',
        type: 'date',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'end_time',
      new TableColumn({
        name: 'end_time',
        type: 'date',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'break_start_time',
      new TableColumn({
        name: 'break_start_time',
        type: 'date',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'shifts',
      'break_end_time',
      new TableColumn({
        name: 'break_end_time',
        type: 'date',
        isNullable: false,
      })
    );
  }
}
