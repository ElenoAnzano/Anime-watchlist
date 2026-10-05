import { db } from "@/lib/prisma";

export async function createComment(animeId: number, content: string) {
  return db.orm.public.Comment.create({ animeId, content });
}

export async function getCommentsByAnime(animeId: number) {
  return db.orm.public.Comment
    .where({ animeId })
    .orderBy((c) => c.createdAt.desc())
    .all();
}