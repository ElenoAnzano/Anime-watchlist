import { Router } from "express";
import * as ratingController from "@/controllers/rating.controller";

const router = Router();

router.get("/", ratingController.getAllRatings);
router.get("/anime/:animeId", ratingController.getRatingsForAnime);
router.post("/", ratingController.createRating);

export default router;
