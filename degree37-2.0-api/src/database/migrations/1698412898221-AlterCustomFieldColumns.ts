import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export enum appliesToTypeEnum {
  ACCOUNTS = '1',
  DONOR_CENTERS = '2',
  DONORS = '3',
  DRIVES = '4',
  LOCATIONS = '5',
  NCES = '6',
  SESSIONS = '7',
  STAFF = '8',
  VOLUNTEERS = '9',
}

export enum fieldDataTypeEnum {
  DateTime = '1',
  Decimal = '2',
  Number = '3',
  PickList = '4',
  Text = '5',
  TextArray = '6',
  TrueOrFalse = '7',
  YesOrNo = '8',
}

export class AlterCustomFieldColumns1698412898221
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing columns
    await queryRunner.dropColumn('custom_fields', 'applies_to');
    await queryRunner.dropColumn('custom_fields', 'field_data_type');

    // Add new columns
    await queryRunner.addColumn(
      'custom_fields',
      new TableColumn({
        name: 'applies_to',
        type: 'enum',
        isNullable: true,
        enum: Object.values(appliesToTypeEnum),
      })
    );

    await queryRunner.addColumn(
      'custom_fields',
      new TableColumn({
        name: 'field_data_type',
        type: 'enum',
        isNullable: true,
        enum: Object.values(fieldDataTypeEnum),
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new columns
    await queryRunner.dropColumn('custom_fields', 'applies_to');
    await queryRunner.dropColumn('custom_fields', 'field_data_type');

    // Recreate old columns
    await queryRunner.addColumn(
      'custom_fields',
      new TableColumn({
        name: 'applies_to',
        type: 'enum',
        enum: Object.values(appliesToTypeEnum),
      })
    );

    await queryRunner.addColumn(
      'custom_fields',
      new TableColumn({
        name: 'field_data_type',
        type: 'enum',
        enum: Object.values(fieldDataTypeEnum),
      })
    );
  }
}
