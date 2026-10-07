import { db } from "@/lib/prisma";

export async function getWatchlist() {
  return db.orm.public.WatchlistItem
    .orderBy((w) => w.createdAt.asc())
    .all();
}

export async function findByAnime(animeId: number) {
  return db.orm.public.WatchlistItem.where({ animeId }).first();
}

export async function addToWatchlist(animeId: number) {
  return db.orm.public.WatchlistItem.create({ animeId });
}

export async function removeFromWatchlist(animeId: number) {
  return db.orm.public.WatchlistItem.where({ animeId }).delete();
}
