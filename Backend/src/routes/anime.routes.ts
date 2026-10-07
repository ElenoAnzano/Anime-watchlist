import { Router } from "express";
import * as animeController from "@/controllers/anime.controller";

const router = Router();

router.get("/", animeController.getAllAnime);
router.get("/:id", animeController.getAnime);
router.post("/", animeController.createAnime);
router.put("/:id", animeController.updateAnime);
router.delete("/:id", animeController.deleteAnime);

export default router;
