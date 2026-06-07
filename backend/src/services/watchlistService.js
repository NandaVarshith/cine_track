import { Movie } from "../models/movie.js";
import { allowedStatuses, WatchList } from "../models/watchList.js";

export async function getWatchList(userId) {
  const entries = await WatchList.find({ userId });
  const result = [];
  for (const entry of entries) {
    const movie = await Movie.findById(entry.movieId);
    if (movie) {
      result.push({
        movieId: entry.movieId,
        movie,
        status: entry.status,
        updatedAt: entry.updatedAt,
      });
    }
  }
  return result;
}

export async function upsertWatchList(userId, movieId, status) {
  const safeStatus = allowedStatuses.includes(status) ? status : "PLANNED";
  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new Error("Movie not found.");
  }

  const entry = await WatchList.findOneAndUpdate(
    { userId, movieId },
    { userId, movieId, status: safeStatus, updatedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    movieId: entry.movieId,
    movie,
    status: entry.status,
    updatedAt: entry.updatedAt,
  };
}

export function removeWatchListItem(userId, movieId) {
  return WatchList.deleteOne({ userId, movieId });
}

export async function getStatus(userId, movieId) {
  const entry = await WatchList.findOne({ userId, movieId });
  return entry?.status || null;
}
