import { Movie } from "../models/movie.js";
import { notFound } from "../utils/httpErrors.js";

function regex(value) {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

function byRatingVotesTitle(a, b) {
  return (b.rating ?? -Infinity) - (a.rating ?? -Infinity)
    || (b.votes ?? -Infinity) - (a.votes ?? -Infinity)
    || (a.title || "").localeCompare(b.title || "");
}

export async function searchMoviesByParams(title, genre) {
  if (title?.trim()) {
    return Movie.find({ title: regex(title.trim()) });
  }
  if (genre?.trim()) {
    return Movie.find({ genre: regex(genre.trim()) });
  }
  return Movie.find();
}

export async function getMovieById(id) {
  const movie = await Movie.findById(id);
  if (!movie) {
    throw notFound(`Movie not found with id: ${id}`);
  }
  return movie;
}

export async function searchMovies(query) {
  if (!query?.trim()) {
    return Movie.find();
  }
  const queryRegex = regex(query.trim());
  return Movie.find({ $or: [{ title: queryRegex }, { genre: queryRegex }] });
}

export async function getMoviesByGenre(genre) {
  if (!genre?.trim()) {
    return Movie.find();
  }
  return Movie.find({ genre: regex(genre.trim()) });
}

export async function getTopRatedMovies() {
  return Movie.find().sort({ rating: -1 }).limit(10);
}

export async function getPopularMovies() {
  return Movie.find().sort({ votes: -1, rating: -1 }).limit(10);
}

export async function getTrendingMovies() {
  const cutoffYear = new Date().getFullYear() - 1;
  const trending = await Movie.find({ release_year: { $gte: cutoffYear } })
    .sort({ votes: -1, rating: -1 })
    .limit(10);
  return trending.length ? trending : getPopularMovies();
}

export async function getRecommendedMovies() {
  return Movie.find().sort({ rating: -1, votes: -1 }).limit(3);
}

export async function getCategoryRows() {
  const [topRated, action, sciFi, popular] = await Promise.all([
    getTopRatedMovies(),
    Movie.find({ genre: regex("Action") }).sort({ rating: -1 }).limit(10),
    Movie.find({ genre: regex("Sci-Fi") }).sort({ rating: -1 }).limit(10),
    getPopularMovies(),
  ]);
  return {
    "Top Rated Movies": topRated,
    "Action Movies": action,
    "Sci-Fi Movies": sciFi,
    "Popular This Week": popular,
  };
}

export async function getSimilarMovies(movieId) {
  const movie = await getMovieById(movieId);
  const genres = (movie.genre || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const seen = new Set([movieId]);
  const results = [];
  for (const genre of genres) {
    const candidates = await Movie.find({ genre: regex(genre) }).sort({ rating: -1 }).limit(10);
    for (const candidate of candidates) {
      const id = candidate.id;
      if (!seen.has(id)) {
        seen.add(id);
        results.push(candidate);
      }
      if (results.length >= 10) {
        return results;
      }
    }
  }

  if (results.length) {
    return results;
  }

  const fallback = await getTopRatedMovies();
  return fallback.filter((candidate) => candidate.id !== movieId).slice(0, 10);
}

export async function createMovie(moviePayload) {
  return Movie.create(moviePayload);
}

export async function updateMovie(id, moviePayload) {
  const movie = await getMovieById(id);
  const fields = [
    "imdb_id",
    "title",
    "poster_url",
    "overview",
    "releaseYear",
    "rating",
    "votes",
    "country",
    "genre",
    "language",
    "runtime",
  ];
  for (const field of fields) {
    movie[field] = moviePayload[field];
  }
  return movie.save();
}

export async function deleteMovie(id) {
  const movie = await getMovieById(id);
  await movie.deleteOne();
}

export function sortMoviesForChatbot(movies) {
  return [...movies].sort(byRatingVotesTitle);
}
