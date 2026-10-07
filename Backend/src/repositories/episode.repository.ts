import { db } from "@/lib/prisma";
import type { CreateEpisodeInput, UpdateEpisodeInput } from "@/schema/validation";

export async function getEpisodeById(id: number) {
  return db.orm.public.Episode.where({ id }).include("anime").first();
}

export async function episodeExists(id: number) {
  const episode = await db.orm.public.Episode.where({ id }).select("id").first();
  return episode !== null;
}

export async function findByAnimeAndNumber(animeId: number, episodeNumber: number) {
  return db.orm.public.Episode
    .where({ animeId, episodeNumber })
    .select("id")
    .first();
}

export async function createEpisode(data: CreateEpisodeInput) {
  return db.orm.public.Episode.create(data);
}

// Returns null when no episode has this id.
export async function updateEpisode(id: number, data: Omit<UpdateEpisodeInput, "id">) {
  return db.orm.public.Episode.where({ id }).update(data);
}

// Returns null when no episode has this id.
export async function deleteEpisode(id: number) {
  return db.orm.public.Episode.where({ id }).delete();
}
