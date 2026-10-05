import * as commentRepository from "@/repositories/comment.repository";
import { assertAnimeExists } from "@/services/anime.service";
import { BadRequestError } from "@/schema/errors";

export async function createComment(animeId: number, content: string) {
  assertAnimeExists(animeId);

  const text = content.trim();
  if (!text) {
    throw new BadRequestError("Comment cannot be empty");
  }

  return commentRepository.createComment(animeId, text);
}

export async function getCommentsByAnime(animeId: number) {
  assertAnimeExists(animeId);
  return commentRepository.getCommentsByAnime(animeId);
}
