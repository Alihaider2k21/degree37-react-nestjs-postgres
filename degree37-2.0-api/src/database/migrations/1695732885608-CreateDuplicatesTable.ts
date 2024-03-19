import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import GenericColumns from '../common/generic-columns';
import { PolymorphicType } from '../../api/common/enums/polymorphic-type.enum';
import { dropTables } from '../utils/dropTables';

export class CreateDuplicatesTable1695732885608 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // drop old table if exists
    await dropTables(queryRunner, 'staff_duplicates');

    // create new table
    await queryRunner.createTable(
      new Table({
        name: 'duplicates',
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

    // create table constraints
    await Promise.all([
      queryRunner.createForeignKey(
        'duplicates',
        new TableForeignKey({
          columnNames: ['created_by'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'NO ACTION',
          onUpdate: 'NO ACTION',
        })
      ),
      queryRunner.createForeignKey(
        'duplicates',
        new TableForeignKey({
          columnNames: ['tenant_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'tenant',
          onDelete: 'NO ACTION',
          onUpdate: 'NO ACTION',
        })
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropTables(queryRunner, 'duplicates');
  }
}
