import type { Request, Response } from "express";
import * as ratingService from "@/services/rating.service";
import { animeIdParam, createRatingSchema } from "@/schema/validation";

export async function createRating(req: Request, res: Response) {
  const { animeId, score } = createRatingSchema.parse(req.body);
  const rating = await ratingService.createRating(animeId, score);
  const summary = await ratingService.getRatingSummary(animeId);
  res.status(201).json({ rating, summary });
}

export async function getRatingsForAnime(req: Request, res: Response) {
  const animeId = animeIdParam.parse(req.params.animeId);
  const summary = await ratingService.getRatingSummary(animeId);
  res.status(200).json(summary);
}

export async function getAllRatings(_req: Request, res: Response) {
  const summaries = await ratingService.getAllRatingSummaries();
  res.status(200).json(summaries);
}
