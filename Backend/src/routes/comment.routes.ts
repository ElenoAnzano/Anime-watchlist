import { Router } from "express";
import * as commentController from "@/controllers/comment.controller";

const router = Router();

router.get("/anime/:animeId", commentController.getCommentsForAnime);
router.post("/", commentController.createComment);

export default router;
