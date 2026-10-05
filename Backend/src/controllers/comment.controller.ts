import type { Request, Response } from "express";
import * as commentService from "@/services/comment.service";
import { animeIdParam, createCommentSchema } from "@/schema/validation";

export async function createComment(req: Request, res: Response) {
  const { animeId, content } = createCommentSchema.parse(req.body);
  const comment = await commentService.createComment(animeId, content);
  res.status(201).json(comment);
}

export async function getCommentsForAnime(req: Request, res: Response) {
  const animeId = animeIdParam.parse(req.params.animeId);
  const comments = await commentService.getCommentsByAnime(animeId);
  res.status(200).json(comments);
}
