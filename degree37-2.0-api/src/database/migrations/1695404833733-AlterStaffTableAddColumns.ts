import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
export class AlterStaffTableAddColumns1695404833733
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const staff_prefix_exists = await queryRunner.hasColumn('staff', 'prefix');
    if (!staff_prefix_exists) {
      await queryRunner.addColumn(
        'staff',
        new TableColumn({ name: 'prefix', type: 'bigint', isNullable: true })
      );
    }

    const staff_suffix_exists = await queryRunner.hasColumn('staff', 'suffix');
    if (!staff_suffix_exists) {
      await queryRunner.addColumn(
        'staff',
        new TableColumn({ name: 'suffix', type: 'bigint', isNullable: true })
      );
    }

    const staff_first_name_exists = await queryRunner.hasColumn(
      'staff',
      'first_name'
    );
    if (!staff_first_name_exists) {
      await queryRunner.addColumn(
        'staff',
        new TableColumn({
          name: 'first_name',
          type: 'varchar',
          length: '60',
          isNullable: false,
        })
      );
    }

    const staff_last_name_exists = await queryRunner.hasColumn(
      'staff',
      'last_name'
    );
    if (!staff_last_name_exists) {
      await queryRunner.addColumn(
        'staff',
        new TableColumn({
          name: 'last_name',
          type: 'varchar',
          length: '60',
          isNullable: false,
        })
      );
    }

    const staff_nick_name_exists = await queryRunner.hasColumn(
      'staff',
      'nick_name'
    );
    if (!staff_nick_name_exists) {
      await queryRunner.addColumn(
        'staff',
        new TableColumn({
          name: 'nick_name',
          type: 'varchar',
          length: '60',
          isNullable: false,
        })
      );
    }

    const staff_birth_date_exists = await queryRunner.hasColumn(
      'staff',
      'birth_date'
    );
    if (!staff_birth_date_exists) {
      await queryRunner.addColumn(
        'staff',
        new TableColumn({
          name: 'birth_date',
          type: 'timestamp',
          precision: 6,
          isNullable: false,
        })
      );
    }

    const staff_classification_id_exists = await queryRunner.hasColumn(
      'staff',
      'classification_id'
    );
    if (!staff_classification_id_exists) {
      await queryRunner.addColumn(
        'staff',
        new TableColumn({
          name: 'classification_id',
          type: 'bigint',
          isNullable: false,
        })
      );
    }

    const staff_title_exists = await queryRunner.hasColumn('staff', 'title');
    if (!staff_title_exists) {
      await queryRunner.addColumn(
        'staff',
        new TableColumn({
          name: 'title',
          type: 'varchar',
          length: '60',
          isNullable: true,
        })
      );
    }

    const staff_collection_operation_id_exists = await queryRunner.hasColumn(
      'staff',
      'collection_operation_id'
    );
    if (!staff_collection_operation_id_exists) {
      await queryRunner.addColumn(
        'staff',
        new TableColumn({
          name: 'collection_operation_id',
          type: 'bigint',
          isNullable: false,
        })
      );
    }

    await queryRunner.createForeignKey(
      'staff',
      new TableForeignKey({
        columnNames: ['suffix'],
        referencedColumnNames: ['id'],
        referencedTableName: 'suffixes',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff',
      new TableForeignKey({
        columnNames: ['prefix'],
        referencedColumnNames: ['id'],
        referencedTableName: 'prefixes',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff',
      new TableForeignKey({
        columnNames: ['classification_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staffing_classification',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );

    await queryRunner.createForeignKey(
      'staff',
      new TableForeignKey({
        columnNames: ['collection_operation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_units',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('staff', 'FK_prefix');
    await queryRunner.dropForeignKey('staff', 'FK_suffix');
    await queryRunner.dropForeignKey('staff', 'FK_collection_operation_id');
    await queryRunner.dropForeignKey('staff', 'FK_classification_id');
    await queryRunner.dropColumns('staff', [
      new TableColumn({ name: 'prefix', type: 'bigint', isNullable: true }),
      new TableColumn({ name: 'suffix', type: 'bigint', isNullable: true }),
      new TableColumn({
        name: 'first_name',
        type: 'varchar',
        length: '60',
        isNullable: false,
      }),
      new TableColumn({
        name: 'last_name',
        type: 'varchar',
        length: '60',
        isNullable: false,
      }),
      new TableColumn({
        name: 'nick_name',
        type: 'varchar',
        length: '60',
        isNullable: false,
      }),
      new TableColumn({
        name: 'birth_date',
        type: 'timestamp',
        precision: 6,
        isNullable: false,
      }),
      new TableColumn({
        name: 'classification_id',
        type: 'bigint',
        isNullable: false,
      }),
      new TableColumn({
        name: 'title',
        type: 'varchar',
        length: '60',
        isNullable: true,
      }),
      new TableColumn({
        name: 'collection_operation_id',
        type: 'bigint',
        isNullable: false,
      }),
    ]);
  }
}
