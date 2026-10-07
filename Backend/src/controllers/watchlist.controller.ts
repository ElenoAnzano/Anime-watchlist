import type { Request, Response } from "express";
import * as watchlistService from "@/services/watchlist.service";
import { addToWatchlistSchema, animeIdParam } from "@/schema/validation";

export async function getWatchlist(_req: Request, res: Response) {
  const items = await watchlistService.getWatchlist();
  res.status(200).json(items);
}

export async function addToWatchlist(req: Request, res: Response) {
  const { animeId } = addToWatchlistSchema.parse(req.body);
  const { item, created } = await watchlistService.addToWatchlist(animeId);
  res.status(created ? 201 : 200).json(item);
}

export async function removeFromWatchlist(req: Request, res: Response) {
  const animeId = animeIdParam.parse(req.params.animeId);
  await watchlistService.removeFromWatchlist(animeId);
  res.status(204).end();
}
