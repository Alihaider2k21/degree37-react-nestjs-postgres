import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterShiftsProjectionStaffAddProcedureTypeQTY1699283191079
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      !(await queryRunner.hasColumn(
        'shifts_projections_staff',
        'procedure_type_qty'
      ))
    )
      await queryRunner.addColumn(
        'shifts_projections_staff',
        new TableColumn({
          name: 'procedure_type_qty',
          type: 'int',
          isNullable: true,
          default: 0,
        })
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'shifts_projections_staff',
      'procedure_type_qty'
    );
  }
}
