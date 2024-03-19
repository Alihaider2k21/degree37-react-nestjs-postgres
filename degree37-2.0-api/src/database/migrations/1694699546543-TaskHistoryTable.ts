export enum OwnerEnum {
  RECRUITERS = 'Recruiters',
  SCHEDULERS = 'Schedulers',
  LEADTELERECRUITER = 'Lead Telerecruiter',
}

export enum AppliesToEnum {
  ACCOUNTS = 'Accounts',
  LOCATIONS = 'Locations',
  DONORCENTERS = 'Donor Centers',
  DONORS = 'Donors',
  STAFF = 'Staff',
  VOLUNTEERS = 'Volunteers',
  DRIVES = 'Drives',
  SESSIONS = 'Sessions',
  NCES = 'NCEs',
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TaskHistoryTable1694699546542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'task_history',
        columns: [
          {
            name: 'rowkey',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'id', type: 'bigint', isNullable: false },
          { name: 'name', type: 'varchar', length: '60' },
          { name: 'description', type: 'text' },
          { name: 'owner', type: 'enum', enum: Object.values(OwnerEnum) },
          {
            name: 'applies_to',
            type: 'enum',
            enum: Object.values(AppliesToEnum),
          },
          { name: 'offset', type: 'int' },
          { name: 'collection_operation', type: 'varchar' },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'created_at',
            type: 'timestamp',
            precision: 6,
            default: `('now'::text)::timestamp(6) with time zone`,
          },
          { name: 'history_reason', type: 'varchar', length: '1' },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          { name: 'created_by', type: 'bigint', isNullable: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task_history');
  }
}
