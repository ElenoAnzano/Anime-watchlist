import { db } from "@/lib/prisma";
import type { CreateAnimeInput, UpdateAnimeInput } from "@/schema/validation";

export async function getAllAnime() {
  return db.orm.public.Anime
    .include("episodes", (episodes) =>
      episodes.orderBy((e) => e.episodeNumber.asc()),
    )
    .orderBy((a) => a.id.asc())
    .all();
}

export async function getAnimeById(id: number) {
  return db.orm.public.Anime
    .where({ id })
    .include("episodes", (episodes) =>
      episodes.orderBy((e) => e.episodeNumber.asc()),
    )
    .first();
}

export async function createAnime(data: CreateAnimeInput) {
  return db.orm.public.Anime.create(data);
}

// Returns null when no anime has this id.
export async function updateAnime(id: number, data: Omit<UpdateAnimeInput, "id">) {
  return db.orm.public.Anime.where({ id }).update(data);
}

// Episodes, comments, ratings and the watchlist entry are removed by the
// database's ON DELETE CASCADE. Returns null when no anime has this id.
export async function deleteAnime(id: number) {
  return db.orm.public.Anime.where({ id }).delete();
}

export async function animeExists(id: number) {
  const anime = await db.orm.public.Anime.where({ id }).select("id").first();
  return anime !== null;
}
