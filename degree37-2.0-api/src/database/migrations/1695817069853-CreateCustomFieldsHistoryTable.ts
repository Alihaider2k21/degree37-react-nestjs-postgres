import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export enum appliesToTypeEnum {
  ACCOUNTS = '1',
  LOCATIONS = '2',
  DONOR_CENTERS = '3',
  DONORS = '4',
  STAFF = '5',
  VOLUNTEERS = '6',
  DRIVES = '7',
  SESSIONS = '8',
  NCES = '9',
}

export enum fieldDataTypeEnum {
  Text = '1',
  Number = '2',
  Decimal = '3',
  DateTime = '4',
  YesOrNo = '5',
  TrueOrFalse = '6',
  TextArray = '7',
  PickList = '8',
}

export class CreateCustomFieldsHistoryTable1695817069853
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'custom_fields_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'history_reason', type: 'varchar', length: '1' },
          { name: 'field_name', type: 'varchar', length: '60' },

          {
            name: 'applies_to',
            type: 'enum',
            enum: Object.values(appliesToTypeEnum),
          },
          {
            name: 'field_data_type',
            type: 'enum',
            enum: Object.values(fieldDataTypeEnum),
          },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'is_required',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          {
            name: 'created_by',
            type: 'bigint',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('custom_fields_history');
  }
}
