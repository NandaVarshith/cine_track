import { Movie } from "../models/movie.js";
import { WatchProgress } from "../models/watchProgress.js";

export async function getRecentProgress(userId) {
  const entries = await WatchProgress.find({ userId }).sort({ updatedAt: -1 }).limit(10);
  const result = [];
  for (const entry of entries) {
    const movie = await Movie.findById(entry.movieId);
    if (movie) {
      result.push({
        movieId: entry.movieId,
        movie,
        progressPercent: entry.progressPercent,
        updatedAt: entry.updatedAt,
      });
    }
  }
  return result;
}

export function getProgress(userId, movieId) {
  return WatchProgress.findOne({ userId, movieId });
}

export async function upsertProgress(userId, movieId, progressPercent) {
  if (!movieId?.trim()) {
    throw new Error("Movie id is required.");
  }
  if (progressPercent == null || progressPercent < 0 || progressPercent > 100) {
    throw new Error("Progress must be between 0 and 100.");
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new Error("Movie not found.");
  }

  const entry = await WatchProgress.findOneAndUpdate(
    { userId, movieId },
    { userId, movieId, progressPercent, updatedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    movieId: entry.movieId,
    movie,
    progressPercent: entry.progressPercent,
    updatedAt: entry.updatedAt,
  };
}
