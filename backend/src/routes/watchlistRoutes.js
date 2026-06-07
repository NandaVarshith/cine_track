import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getStatus,
  getWatchList,
  removeWatchListItem,
  upsertWatchList,
} from "../services/watchlistService.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    res.json(await getWatchList(req.userId));
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    res.json(await upsertWatchList(req.userId, req.body.movieId, req.body.status));
  } catch (error) {
    next(error);
  }
});

router.patch("/:movieId", requireAuth, async (req, res, next) => {
  try {
    res.json(await upsertWatchList(req.userId, req.params.movieId, req.body.status));
  } catch (error) {
    next(error);
  }
});

router.get("/status/:movieId", requireAuth, async (req, res, next) => {
  try {
    const status = await getStatus(req.userId, req.params.movieId);
    if (!status) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json({ status });
  } catch (error) {
    next(error);
  }
});

router.delete("/:movieId", requireAuth, async (req, res, next) => {
  try {
    await removeWatchListItem(req.userId, req.params.movieId);
    res.json({ message: "Removed" });
  } catch (error) {
    next(error);
  }
});

export default router;
