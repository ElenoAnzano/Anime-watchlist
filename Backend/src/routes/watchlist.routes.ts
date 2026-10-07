import { Router } from "express";
import * as watchlistController from "@/controllers/watchlist.controller";

const router = Router();

router.get("/", watchlistController.getWatchlist);
router.post("/", watchlistController.addToWatchlist);
router.delete("/anime/:animeId", watchlistController.removeFromWatchlist);

export default router;
