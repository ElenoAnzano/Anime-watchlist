import { NotFoundError } from "@/schema/errors";

// The anime catalog lives in the frontend (Frontend/src/stores/anime.ts) and
// there is no Anime table. Keep these IDs in sync with that catalog.
const ANIME_IDS = new Set([1, 2, 3, 4, 5, 6]);

export function assertAnimeExists(animeId: number) {
  if (!ANIME_IDS.has(animeId)) {
    throw new NotFoundError(`Anime ${animeId} not found`);
  }
}
