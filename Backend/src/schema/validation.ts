import { z } from "zod";

// Request shape checks only. Business rules (e.g. the 1–5 rating range)
// live in the services.

export const animeIdParam = z.coerce.number().int().positive();

export const createRatingSchema = z.object({
  animeId: z.number().int().positive(),
  score: z.number(),
});

export const createCommentSchema = z.object({
  animeId: z.number().int().positive(),
  content: z.string().max(1000),
});
