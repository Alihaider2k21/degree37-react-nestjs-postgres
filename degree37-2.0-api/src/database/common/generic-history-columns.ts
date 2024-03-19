import { TableColumnOptions } from 'typeorm';

const genericHistoryColumns: TableColumnOptions[] = [
  {
    name: 'rowkey',
    type: 'bigint',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
  },
  {
    name: 'history_reason',
    type: 'varchar',
    length: '1',
    isNullable: false,
  },
  {
    name: 'id',
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
    isNullable: false,
  },
];

export default genericHistoryColumns;
