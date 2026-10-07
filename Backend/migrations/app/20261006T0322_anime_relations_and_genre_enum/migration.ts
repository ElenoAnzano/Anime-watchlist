#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/317353a5c290c1fc072df9e510389d092b5d11b59a87a7fbd4357d82a725c1c7/contract';
import startContract from '../../snapshots/317353a5c290c1fc072df9e510389d092b5d11b59a87a7fbd4357d82a725c1c7/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f61fd8fbde591c58a868219ad436e9da5a99518a9d49f2287c8acb047fb89045/contract';
import endContract from '../../snapshots/f61fd8fbde591c58a868219ad436e9da5a99518a9d49f2287c8acb047fb89045/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addCheckConstraint({
        schema: 'public',
        table: 'Anime',
        constraint: 'Anime_genre_check_12e15c29',
        expression:
          "\"genre\"::text[] <@ ARRAY['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Isekai', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Supernatural']::text[]",
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Comment',
        foreignKey: {
          name: 'Comment_animeId_fkey',
          columns: ['animeId'],
          references: { schema: 'public', table: 'Anime', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Rating',
        foreignKey: {
          name: 'Rating_animeId_fkey',
          columns: ['animeId'],
          references: { schema: 'public', table: 'Anime', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'WatchlistItem',
        foreignKey: {
          name: 'WatchlistItem_animeId_fkey',
          columns: ['animeId'],
          references: { schema: 'public', table: 'Anime', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
