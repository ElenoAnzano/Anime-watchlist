import { Router } from "express";
import * as episodeController from "@/controllers/episode.controller";

const router = Router();

router.post("/", episodeController.createEpisode);
router.get("/:id", episodeController.getEpisode);
router.put("/:id", episodeController.updateEpisode);
router.delete("/:id", episodeController.deleteEpisode);

export default router;
