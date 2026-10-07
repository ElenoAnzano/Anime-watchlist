#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/317353a5c290c1fc072df9e510389d092b5d11b59a87a7fbd4357d82a725c1c7/contract';
import endContract from '../../snapshots/317353a5c290c1fc072df9e510389d092b5d11b59a87a7fbd4357d82a725c1c7/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a07979c375597a2c774297e3cbaa28df6272ed834cd3158f3acba8ae137c0085/contract';
import startContract from '../../snapshots/a07979c375597a2c774297e3cbaa28df6272ed834cd3158f3acba8ae137c0085/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Anime',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('genre', 'text[]', { notNull: true, codecRef: { codecId: 'pg/text@1', many: true } }),
          col('id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('image', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Anime_genre_elem_not_null_b114cd62',
            'array_position("genre", NULL) IS NULL',
          ),
          checkExpression('Anime_type_check_4c168588', "\"type\" IN ('TV', 'Movie')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Episode',
        columns: [
          col('animeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('episodeNumber', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('youtubeId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Episode',
        constraint: 'Episode_animeId_episodeNumber_key',
        columns: ['animeId', 'episodeNumber'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Episode',
        index: 'Episode_animeId_idx_46bb9889',
        columns: ['animeId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Episode',
        foreignKey: {
          name: 'Episode_animeId_fkey',
          columns: ['animeId'],
          references: { schema: 'public', table: 'Anime', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
