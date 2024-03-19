import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import GenericHistoryColumns from '../common/generic-history-columns';
import { PolymorphicType } from '../../api/common/enums/polymorphic-type.enum';
import { dropTables } from '../utils/dropTables';

export class CreateDuplicatesHistoryTable1696245309772
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create new table
    await queryRunner.createTable(
      new Table({
        name: 'duplicates_history',
        columns: [
          ...GenericHistoryColumns,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropTables(queryRunner, 'duplicates_history');
  }
}
