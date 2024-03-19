import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import genericColumns from '../common/generic-columns';

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

export class CreateCustomFieldsTable1695815816580
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'custom_fields',
        columns: [
          ...genericColumns,
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
        ],
      })
    );

    await queryRunner.createForeignKey(
      'custom_fields',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'custom_fields',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('custom_fields', 'created_by');
    await queryRunner.dropForeignKey('custom_fields', 'tenant_id');
    // Then, drop the table
    await queryRunner.dropTable('custom_fields');
  }
}
