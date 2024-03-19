import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftsProjectionStaffHistory1700028883616
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      !(await queryRunner.hasColumn(
        'shifts_projections_staff_history',
        'procedure_type_qty'
      ))
    )
      await queryRunner.addColumn(
        'shifts_projections_staff_history',
        new TableColumn({
          name: 'procedure_type_qty',
          type: 'float',
          isNullable: true,
          default: 0,
        })
      );
    await queryRunner.changeColumn(
      'shifts_projections_staff_history',
      new TableColumn({
        name: 'product_yield',
        type: 'int',
        isNullable: false,
      }),
      new TableColumn({
        name: 'product_yield',
        isNullable: true,
        type: 'float',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'shifts_projections_staff_history',
      'procedure_type_qty'
    );
    await queryRunner.changeColumn(
      'shifts_projections_staff_history',
      new TableColumn({
        name: 'product_yield',
        isNullable: true,
        type: 'float',
      }),
      new TableColumn({
        name: 'product_yield',
        type: 'int',
        isNullable: false,
      })
    );
  }
}
