#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/a07979c375597a2c774297e3cbaa28df6272ed834cd3158f3acba8ae137c0085/contract';
import endContract from '../../snapshots/a07979c375597a2c774297e3cbaa28df6272ed834cd3158f3acba8ae137c0085/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f38202e107506a1ac1c57911b5dad8d1cd618e078354e7097604bc9ab7fc0e4e/contract';
import startContract from '../../snapshots/f38202e107506a1ac1c57911b5dad8d1cd618e078354e7097604bc9ab7fc0e4e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'WatchlistItem',
        columns: [
          col('animeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'WatchlistItem',
        constraint: 'WatchlistItem_animeId_key',
        columns: ['animeId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
