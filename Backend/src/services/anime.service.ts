import * as animeRepository from "@/repositories/anime.repository";
import { BadRequestError, ConflictError, NotFoundError } from "@/schema/errors";
import type { CreateAnimeInput, UpdateAnimeInput } from "@/schema/validation";

export async function assertAnimeExists(animeId: number) {
  if (!(await animeRepository.animeExists(animeId))) {
    throw new NotFoundError(`Anime ${animeId} not found`);
  }
}

export async function getAllAnime() {
  return animeRepository.getAllAnime();
}

export async function getAnime(id: number) {
  const anime = await animeRepository.getAnimeById(id);
  if (!anime) {
    throw new NotFoundError(`Anime ${id} not found`);
  }
  return anime;
}

// Only the Anime row is created; episodes, comments, ratings and the
// watchlist entry are added through their own endpoints using animeId.
export async function createAnime(data: CreateAnimeInput) {
  if (await animeRepository.animeExists(data.id)) {
    throw new ConflictError(`Anime ${data.id} already exists`);
  }
  return animeRepository.createAnime(data);
}

// Full replacement of the Anime's own fields. The id is the primary key that
// related rows point at, so it cannot be changed here.
export async function updateAnime(id: number, data: UpdateAnimeInput) {
  if (data.id !== id) {
    throw new BadRequestError("id in the body must match the id in the URL");
  }

  const { id: _id, ...fields } = data;
  const anime = await animeRepository.updateAnime(id, fields);
  if (!anime) {
    throw new NotFoundError(`Anime ${id} not found`);
  }
  return anime;
}

export async function deleteAnime(id: number) {
  const deleted = await animeRepository.deleteAnime(id);
  if (!deleted) {
    throw new NotFoundError(`Anime ${id} not found`);
  }
}
