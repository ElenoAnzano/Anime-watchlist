import * as episodeRepository from "@/repositories/episode.repository";
import { assertAnimeExists } from "@/services/anime.service";
import { BadRequestError, ConflictError, NotFoundError } from "@/schema/errors";
import type { CreateEpisodeInput, UpdateEpisodeInput } from "@/schema/validation";

export async function getEpisode(id: number) {
  const episode = await episodeRepository.getEpisodeById(id);
  if (!episode) {
    throw new NotFoundError(`Episode ${id} not found`);
  }
  return episode;
}
// unique-constraint error on (animeId, episodeNumber).
async function assertEpisodeNumberFree(
  animeId: number,
  episodeNumber: number,
  ignoreEpisodeId?: number,
) {
  const existing = await episodeRepository.findByAnimeAndNumber(animeId, episodeNumber);
  if (existing && existing.id !== ignoreEpisodeId) {
    throw new ConflictError(
      `Anime ${animeId} already has an episode number ${episodeNumber}`,
    );
  }
}

export async function createEpisode(data: CreateEpisodeInput) {
  await assertAnimeExists(data.animeId);

  if (await episodeRepository.episodeExists(data.id)) {
    throw new ConflictError(`Episode ${data.id} already exists`);
  }
  await assertEpisodeNumberFree(data.animeId, data.episodeNumber);

  return episodeRepository.createEpisode(data);
}

// Full replacement. The id cannot be changed; animeId can, as long as the
// target anime exists and the episode number is free there.
export async function updateEpisode(id: number, data: UpdateEpisodeInput) {
  if (data.id !== id) {
    throw new BadRequestError("id in the body must match the id in the URL");
  }

  if (!(await episodeRepository.episodeExists(id))) {
    throw new NotFoundError(`Episode ${id} not found`);
  }
  await assertAnimeExists(data.animeId);
  await assertEpisodeNumberFree(data.animeId, data.episodeNumber, id);

  const { id: _id, ...fields } = data;
  const episode = await episodeRepository.updateEpisode(id, fields);
  if (!episode) {
    throw new NotFoundError(`Episode ${id} not found`);
  }
  return episode;
}

export async function deleteEpisode(id: number) {
  const deleted = await episodeRepository.deleteEpisode(id);
  if (!deleted) {
    throw new NotFoundError(`Episode ${id} not found`);
  }
}
