import * as watchlistRepository from "@/repositories/watchlist.repository";
import { assertAnimeExists } from "@/services/anime.service";
import { NotFoundError } from "@/schema/errors";

export async function getWatchlist() {
  return watchlistRepository.getWatchlist();
}

export async function addToWatchlist(animeId: number) {
  await assertAnimeExists(animeId);

  const existing = await watchlistRepository.findByAnime(animeId);
  if (existing) {
    return { item: existing, created: false };
  }

  const item = await watchlistRepository.addToWatchlist(animeId);
  return { item, created: true };
}

export async function removeFromWatchlist(animeId: number) {
  await assertAnimeExists(animeId);

  const existing = await watchlistRepository.findByAnime(animeId);
  if (!existing) {
    throw new NotFoundError(`Anime ${animeId} is not in the watchlist`);
  }

  await watchlistRepository.removeFromWatchlist(animeId);
}
