import { TableColumnOptions } from 'typeorm';

const genericColumns: TableColumnOptions[] = [
  {
    name: 'id',
    type: 'bigint',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
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

export default genericColumns;
