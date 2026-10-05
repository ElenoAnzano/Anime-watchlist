import { db } from "@/lib/prisma";

export async function createRating(animeId: number, score: number) {
  return db.orm.public.Rating.create({ animeId, score });
}

export async function getRatingSummaryData(animeId: number) {
  return db.orm.public.Rating
    .where({ animeId })
    .aggregate((a) => ({
      count: a.count(),
      average: a.avg("score"),
    }));
}

export async function getAllRatingSummaryData() {
  return db.orm.public.Rating
    .groupBy("animeId")
    .aggregate((a) => ({
      count: a.count(),
      average: a.avg("score"),
    }));
}