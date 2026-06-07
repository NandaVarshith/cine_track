import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  deleteReview,
  getReviewsForMovie,
  getReviewsForUser,
  updateReview,
  upsertReview,
} from "../services/reviewService.js";

const router = Router();

router.get("/movie/:movieId", async (req, res, next) => {
  try {
    res.json(await getReviewsForMovie(req.params.movieId));
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    res.json(await getReviewsForUser(req.userId));
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    res.json(await upsertReview(req.userId, req.body.movieId, req.body.rating, req.body.comment));
  } catch (error) {
    next(error);
  }
});

router.patch("/:reviewId", requireAuth, async (req, res, next) => {
  try {
    res.json(await updateReview(req.userId, req.params.reviewId, req.body.rating, req.body.comment));
  } catch (error) {
    next(error);
  }
});

router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  try {
    await deleteReview(req.userId, req.params.reviewId);
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
