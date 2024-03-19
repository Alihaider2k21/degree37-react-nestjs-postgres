import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDonorsTableforBBCSSync1701949942716
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('donors', 'suffix_id');

    await queryRunner.addColumns('donors', [
      new TableColumn({
        name: 'middle_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'record_create_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_update_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'next_recruit_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'greatest_deferral_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_donation_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'appointment_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'gender',
        type: 'varchar',
        length: '1',
        isNullable: true,
      }),
      new TableColumn({
        name: 'geo_code',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'group_category',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'race',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'misc_code',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'rec_result',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'gallon_award1',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'gallon_award2',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('donors', 'middle_name');
    await queryRunner.dropColumn('donors', 'record_create_date');
    await queryRunner.dropColumn('donors', 'last_update_date');
    await queryRunner.dropColumn('donors', 'next_recruit_date');
    await queryRunner.dropColumn('donors', 'greatest_deferral_date');
    await queryRunner.dropColumn('donors', 'last_donation_date');
    await queryRunner.dropColumn('donors', 'appointment_date');
    await queryRunner.dropColumn('donors', 'gender');
    await queryRunner.dropColumn('donors', 'geo_code');
    await queryRunner.dropColumn('donors', 'group_category');
    await queryRunner.dropColumn('donors', 'race');
    await queryRunner.dropColumn('donors', 'misc_code');
    await queryRunner.dropColumn('donors', 'rec_result');
    await queryRunner.dropColumn('donors', 'gallon_award1');
    await queryRunner.dropColumn('donors', 'gallon_award2');
  }
}
