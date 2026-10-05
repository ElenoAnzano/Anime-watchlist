#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/daed498ab290e01dd949f309a80790c37d2ba1a607d153f6d4a9e5616f5866f2/contract';
import startContract from '../../snapshots/daed498ab290e01dd949f309a80790c37d2ba1a607d153f6d4a9e5616f5866f2/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f38202e107506a1ac1c57911b5dad8d1cd618e078354e7097604bc9ab7fc0e4e/contract';
import endContract from '../../snapshots/f38202e107506a1ac1c57911b5dad8d1cd618e078354e7097604bc9ab7fc0e4e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Anime' }),
      this.createTable({
        schema: 'public',
        table: 'Comment',
        columns: [
          col('animeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Rating',
        columns: [
          col('animeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('score', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Comment',
        index: 'Comment_animeId_idx_46bb9889',
        columns: ['animeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Rating',
        index: 'Rating_animeId_idx_46bb9889',
        columns: ['animeId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
