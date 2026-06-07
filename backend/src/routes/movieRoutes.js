import { Router } from "express";
import {
  createMovie,
  deleteMovie,
  getCategoryRows,
  getMovieById,
  getMoviesByGenre,
  getPopularMovies,
  getRecommendedMovies,
  getSimilarMovies,
  getTopRatedMovies,
  getTrendingMovies,
  searchMovies,
  searchMoviesByParams,
  updateMovie,
} from "../services/movieService.js";

const router = Router();

router.get("/search", async (req, res, next) => {
  try {
    res.json(await searchMovies(req.query.query));
  } catch (error) {
    next(error);
  }
});

router.get("/genre/:genre", async (req, res, next) => {
  try {
    res.json(await getMoviesByGenre(req.params.genre));
  } catch (error) {
    next(error);
  }
});

router.get("/top-rated", async (_req, res, next) => {
  try {
    res.json(await getTopRatedMovies());
  } catch (error) {
    next(error);
  }
});

router.get("/trending", async (_req, res, next) => {
  try {
    res.json(await getTrendingMovies());
  } catch (error) {
    next(error);
  }
});

router.get("/popular", async (_req, res, next) => {
  try {
    res.json(await getPopularMovies());
  } catch (error) {
    next(error);
  }
});

router.get("/recommended", async (_req, res, next) => {
  try {
    res.json(await getRecommendedMovies());
  } catch (error) {
    next(error);
  }
});

router.get("/categories", async (_req, res, next) => {
  try {
    res.json(await getCategoryRows());
  } catch (error) {
    next(error);
  }
});

router.get("/:id/similar", async (req, res, next) => {
  try {
    res.json(await getSimilarMovies(req.params.id));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.json(await getMovieById(req.params.id));
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    res.json(await searchMoviesByParams(req.query.title, req.query.genre));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.json(await createMovie(req.body));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    res.json(await updateMovie(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteMovie(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
