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

export class CreatePicksListsTable1695817641239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pick_lists',
        columns: [
          ...genericColumns,
          {
            name: 'applies_to',
            type: 'enum',
            enum: Object.values(appliesToTypeEnum),
          },
          {
            name: 'type_name',
            type: 'Varchar(60)',
            isNullable: false,
          },
          {
            name: 'type_value',
            type: 'Varchar(100)',
            isNullable: false,
          },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'custom_field_id',
            type: 'bigint',
            isNullable: false,
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
      'pick_lists',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenant',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'pick_lists',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'pick_lists',
      new TableForeignKey({
        columnNames: ['custom_field_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'custom_fields',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('pick_lists', 'created_by');
    await queryRunner.dropForeignKey('pick_lists', 'tenant_id');
    await queryRunner.dropForeignKey('pick_lists', 'custom_field_id');

    // Then, drop the table
    await queryRunner.dropTable('pick_lists');
  }
}
