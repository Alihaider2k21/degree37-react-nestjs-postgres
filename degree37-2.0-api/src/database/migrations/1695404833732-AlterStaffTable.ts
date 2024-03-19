import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
export class AlterStaffTable1695404833732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const staff_prefix_exists = await queryRunner.hasColumn(
      'staff',
      'staff_prefix'
    );
    if (staff_prefix_exists) {
      await queryRunner.dropColumn('staff', 'staff_prefix');
    }
    const staff_suffix_exists = await queryRunner.hasColumn(
      'staff',
      'staff_suffix'
    );
    if (staff_suffix_exists) {
      await queryRunner.dropColumn('staff', 'staff_suffix');
    }

    const staff_first_name_exists = await queryRunner.hasColumn(
      'staff',
      'first_name'
    );
    if (staff_first_name_exists) {
      await queryRunner.dropColumn('staff', 'first_name');
    }

    const staff_last_name_exists = await queryRunner.hasColumn(
      'staff',
      'last_name'
    );
    if (staff_last_name_exists) {
      await queryRunner.dropColumn('staff', 'last_name');
    }

    const staff_nick_name_exists = await queryRunner.hasColumn(
      'staff',
      'nick_name'
    );
    if (staff_nick_name_exists) {
      await queryRunner.dropColumn('staff', 'nick_name');
    }

    const staff_date_of_birth_exists = await queryRunner.hasColumn(
      'staff',
      'date_of_birth'
    );
    if (staff_date_of_birth_exists) {
      await queryRunner.dropColumn('staff', 'date_of_birth');
    }

    const staff_mailing_address_exists = await queryRunner.hasColumn(
      'staff',
      'mailing_address'
    );
    if (staff_mailing_address_exists) {
      await queryRunner.dropColumn('staff', 'mailing_address');
    }

    const staff_zip_code_exists = await queryRunner.hasColumn(
      'staff',
      'zip_code'
    );
    if (staff_zip_code_exists) {
      await queryRunner.dropColumn('staff', 'zip_code');
    }

    const staff_city_exists = await queryRunner.hasColumn('staff', 'city');
    if (staff_city_exists) {
      await queryRunner.dropColumn('staff', 'city');
    }

    const staff_state_exists = await queryRunner.hasColumn('staff', 'state');
    if (staff_state_exists) {
      await queryRunner.dropColumn('staff', 'state');
    }

    const staff_county_exists = await queryRunner.hasColumn('staff', 'county');
    if (staff_county_exists) {
      await queryRunner.dropColumn('staff', 'county');
    }

    const staff_classification_exists = await queryRunner.hasColumn(
      'staff',
      'classification'
    );
    if (staff_classification_exists) {
      await queryRunner.dropColumn('staff', 'classification');
    }

    const staff_role_exists = await queryRunner.hasColumn('staff', 'role');
    if (staff_role_exists) {
      await queryRunner.dropColumn('staff', 'role');
    }

    const staff_updated_by_exists = await queryRunner.hasColumn(
      'staff',
      'updated_by'
    );
    if (staff_updated_by_exists) {
      await queryRunner.dropColumn('staff', 'updated_by');
    }

    const staff_updated_at_exists = await queryRunner.hasColumn(
      'staff',
      'updated_at'
    );
    if (staff_updated_at_exists) {
      await queryRunner.dropColumn('staff', 'updated_at');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('staff', [
      new TableColumn({
        name: 'staff_prefix',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'staff_suffix',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'first_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'nick_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'date_of_birth',
        type: 'timestamp',
        precision: 6,
        isNullable: false,
      }),
      new TableColumn({
        name: 'mailing_address',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'zip_code',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'city',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'county',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'classification',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'role',
        type: 'bigint',
        isNullable: true,
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      }),
      new TableColumn({
        name: 'updated_by',
        type: 'bigint',
        isNullable: true,
      }),
    ]);
  }
}
