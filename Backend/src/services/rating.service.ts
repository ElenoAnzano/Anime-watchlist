import * as ratingRepository from "@/repositories/rating.repository";
import { assertAnimeExists } from "@/services/anime.service";
import { BadRequestError } from "@/schema/errors";

export const MIN_SCORE = 1;
export const MAX_SCORE = 5;

export interface RatingSummary {
  animeId: number;
  average: number;
  count: number;
}

export async function createRating(animeId: number, score: number) {
  assertAnimeExists(animeId);

  if (!Number.isInteger(score) || score < MIN_SCORE || score > MAX_SCORE) {
    throw new BadRequestError(
      `Rating must be a whole number from ${MIN_SCORE} to ${MAX_SCORE}`,
    );
  }

  return ratingRepository.createRating(animeId, score);
}

export async function getRatingSummary(
  animeId: number,
): Promise<RatingSummary> {
  assertAnimeExists(animeId);
  const result = await ratingRepository.getRatingSummaryData(animeId);

  return {
    animeId,
    average: roundOne(result.average ?? 0),
    count: result.count,
  };
}

export async function getAllRatingSummaries(): Promise<RatingSummary[]> {
  const groups = await ratingRepository.getAllRatingSummaryData();

  return groups.map((g) => ({
    animeId: g.animeId,
    average: roundOne(g.average ?? 0),
    count: g.count,
  }));
}

// Round to one decimal place, e.g. 4.333 → 4.3
function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}
