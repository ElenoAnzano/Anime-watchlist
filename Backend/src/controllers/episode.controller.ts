import type { Request, Response } from "express";
import * as episodeService from "@/services/episode.service";
import {
  createEpisodeSchema,
  episodeIdParam,
  updateEpisodeSchema,
} from "@/schema/validation";

export async function createEpisode(req: Request, res: Response) {
  const data = createEpisodeSchema.parse(req.body);
  const episode = await episodeService.createEpisode(data);
  res.status(201).json(episode);
}

export async function getEpisode(req: Request, res: Response) {
  const id = episodeIdParam.parse(req.params.id);
  const episode = await episodeService.getEpisode(id);
  res.status(200).json(episode);
}

export async function updateEpisode(req: Request, res: Response) {
  const id = episodeIdParam.parse(req.params.id);
  const data = updateEpisodeSchema.parse(req.body);
  const episode = await episodeService.updateEpisode(id, data);
  res.status(200).json(episode);
}

export async function deleteEpisode(req: Request, res: Response) {
  const id = episodeIdParam.parse(req.params.id);
  await episodeService.deleteEpisode(id);
  res.status(204).end();
}
