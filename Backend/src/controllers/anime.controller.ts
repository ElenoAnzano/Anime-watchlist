import type { Request, Response } from "express";
import * as animeService from "@/services/anime.service";
import {
  animeIdParam,
  createAnimeSchema,
  updateAnimeSchema,
} from "@/schema/validation";

export async function createAnime(req: Request, res: Response) {
  const data = createAnimeSchema.parse(req.body);
  const anime = await animeService.createAnime(data);
  res.status(201).json(anime);
}

export async function getAllAnime(_req: Request, res: Response) {
  const anime = await animeService.getAllAnime();
  res.status(200).json(anime);
}

export async function getAnime(req: Request, res: Response) {
  const id = animeIdParam.parse(req.params.id);
  const anime = await animeService.getAnime(id);
  res.status(200).json(anime);
}

export async function updateAnime(req: Request, res: Response) {
  const id = animeIdParam.parse(req.params.id);
  const data = updateAnimeSchema.parse(req.body);
  const anime = await animeService.updateAnime(id, data);
  res.status(200).json(anime);
}

export async function deleteAnime(req: Request, res: Response) {
  const id = animeIdParam.parse(req.params.id);
  await animeService.deleteAnime(id);
  res.status(204).end();
}
