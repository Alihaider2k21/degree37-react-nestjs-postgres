import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import GenericColumns from '../common/generic-columns';
import { PolymorphicType } from '../../api/common/enums/polymorphic-type.enum';

export class CreateStaffDuplicateTable1695459194542
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create table
    await queryRunner.createTable(
      new Table({
        name: 'staff_duplicates',
        columns: [
          ...GenericColumns,
          {
            name: 'record_id',
            type: 'bigint',
          },
          {
            name: 'duplicatable_id',
            type: 'bigint',
          },
          {
            name: 'duplicatable_type',
            type: 'enum',
            enum: Object.values(PolymorphicType),
          },
          {
            name: 'is_resolved',
            type: 'boolean',
            default: false,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
        ],
      }),
      true // set `true` to create the table if it doesn't exist);
    );

    await queryRunner.createForeignKey(
      'staff_duplicates',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_duplicates',
      new TableForeignKey({
        columnNames: ['record_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_duplicates',
      new TableForeignKey({
        columnNames: ['duplicatable_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff_duplicates',
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
    await queryRunner.dropForeignKey('staff_duplicates', 'FK_created_by');
    await queryRunner.dropForeignKey('staff_duplicates', 'FK_duplicatable_id');
    await queryRunner.dropForeignKey('staff_duplicates', 'FK_record_id');
    await queryRunner.dropForeignKey('staff_duplicates', 'FK_tenant_id');

    await queryRunner.dropTable('staff_duplicates');
  }
}
