import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getProgress, getRecentProgress, upsertProgress } from "../services/progressService.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    res.json(await getRecentProgress(req.userId));
  } catch (error) {
    next(error);
  }
});

router.get("/:movieId", requireAuth, async (req, res, next) => {
  try {
    const entry = await getProgress(req.userId, req.params.movieId);
    if (!entry) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json({
      progressPercent: entry.progressPercent,
      updatedAt: entry.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    res.json(await upsertProgress(req.userId, req.body.movieId, req.body.progressPercent));
  } catch (error) {
    next(error);
  }
});

export default router;
