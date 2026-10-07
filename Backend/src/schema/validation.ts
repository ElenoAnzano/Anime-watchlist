import { z } from "zod";
import type { FieldInputTypes } from "@/../prisma/contract.d";

// Request shape checks only. Business rules (e.g. the 1–5 rating range)
// live in the services.

type AnimeInput = FieldInputTypes["public"]["Anime"];

// Must match the Genre and AnimeType enums in prisma/contract.prisma;
// `satisfies` fails the build if a value here is not in the contract.
const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Isekai",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Supernatural",
] as const satisfies readonly AnimeInput["genre"][number][];

const ANIME_TYPES = ["TV", "Movie"] as const satisfies readonly AnimeInput["type"][];

export const animeIdParam = z.coerce.number().int().positive();

export const createAnimeSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  image: z.string().trim().min(1),
  genre: z.array(z.enum(GENRES)).min(1),
  type: z.enum(ANIME_TYPES),
});

export type CreateAnimeInput = z.infer<typeof createAnimeSchema>;

// PUT is a full replacement, so it takes the same shape as create.
export const updateAnimeSchema = createAnimeSchema;

export type UpdateAnimeInput = CreateAnimeInput;

export const episodeIdParam = z.coerce.number().int().positive();

export const createEpisodeSchema = z.object({
  id: z.number().int().positive(),
  animeId: z.number().int().positive(),
  episodeNumber: z.number().int().positive(),
  title: z.string().trim().min(1),
  youtubeId: z.string().trim().min(1),
});

export type CreateEpisodeInput = z.infer<typeof createEpisodeSchema>;

export const updateEpisodeSchema = createEpisodeSchema;

export type UpdateEpisodeInput = CreateEpisodeInput;

export const createRatingSchema = z.object({
  animeId: z.number().int().positive(),
  score: z.number(),
});

export const createCommentSchema = z.object({
  animeId: z.number().int().positive(),
  content: z.string().max(1000),
});

export const addToWatchlistSchema = z.object({
  animeId: z.number().int().positive(),
});
