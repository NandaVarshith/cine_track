import { Movie } from "../models/movie.js";
import { sortMoviesForChatbot } from "./movieService.js";

const DEFAULT_MAX_RESULTS = 6;
const MAX_RESULTS_CAP = 10;

function normalize(value) {
  return (value || "").toLowerCase();
}

function splitTokens(value) {
  if (!value?.trim()) {
    return [];
  }
  return value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function stripCodeFences(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    const firstLineEnd = trimmed.indexOf("\n");
    const lastFence = trimmed.lastIndexOf("```");
    if (firstLineEnd !== -1 && lastFence > firstLineEnd) {
      return trimmed.slice(firstLineEnd + 1, lastFence).trim();
    }
  }
  return trimmed;
}

function resolveMaxResults(requested) {
  if (!requested || requested <= 0) {
    return DEFAULT_MAX_RESULTS;
  }
  return Math.min(requested, MAX_RESULTS_CAP);
}

function fromQuery(query) {
  return {
    replyText: "Here are some picks based on that.",
    query,
    genres: [],
    minRating: null,
    yearFrom: null,
    yearTo: null,
    maxResults: DEFAULT_MAX_RESULTS,
  };
}

async function callGroqForFilters(userMessage) {
  const apiKey = (process.env.GROQ_API_KEY || "").trim();
  if (!apiKey) {
    return null;
  }

  const baseUrl = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const instructions = `You are a movie recommendation assistant. Extract search filters from the user message.
Respond ONLY with a valid JSON object (no markdown) with this schema:
{
  "replyText": string,
  "query": string|null,
  "genres": string[],
  "minRating": number|null,
  "yearFrom": integer|null,
  "yearTo": integer|null,
  "maxResults": integer
}
Keep replyText short and friendly (1 sentence). Use genres like Action, Thriller, Sci-Fi, Drama.
If no filter exists, set fields to null or empty arrays. maxResults between 4 and 10.`;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: userMessage },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const outputText = data?.choices?.[0]?.message?.content;
    if (!outputText?.trim()) {
      return null;
    }
    return JSON.parse(stripCodeFences(outputText));
  } catch {
    return null;
  }
}

function matchesQuery(movie, query) {
  if (!query?.trim()) {
    return true;
  }
  const haystack = [
    movie.title,
    movie.genre,
    movie.overview,
    movie.country,
    movie.language,
  ].map(normalize).join(" ");

  const normalizedQuery = normalize(query);
  if (haystack.includes(normalizedQuery)) {
    return true;
  }
  return splitTokens(normalizedQuery).some((token) => token.length >= 3 && haystack.includes(token));
}

function matchesGenres(movie, genres) {
  if (!genres.length) {
    return true;
  }
  const movieGenres = normalize(movie.genre);
  return genres.some((genre) => movieGenres.includes(normalize(genre)));
}

function matchesYear(movie, yearFrom, yearTo) {
  if (yearFrom == null && yearTo == null) {
    return true;
  }
  const releaseYear = movie.releaseYear;
  if (releaseYear == null) {
    return false;
  }
  if (yearFrom != null && releaseYear < yearFrom) {
    return false;
  }
  return !(yearTo != null && releaseYear > yearTo);
}

function matchesRating(movie, minRating) {
  if (minRating == null) {
    return true;
  }
  return movie.rating != null && movie.rating >= minRating;
}

async function filterMovies(filters) {
  const movies = await Movie.find();
  const genres = Array.isArray(filters.genres)
    ? filters.genres.filter((value) => value && value.trim())
    : [];

  return sortMoviesForChatbot(movies)
    .filter((movie) => matchesQuery(movie, filters.query))
    .filter((movie) => matchesGenres(movie, genres))
    .filter((movie) => matchesYear(movie, filters.yearFrom, filters.yearTo))
    .filter((movie) => matchesRating(movie, filters.minRating))
    .slice(0, resolveMaxResults(filters.maxResults));
}

function buildReply(filters, matches) {
  if (!matches.length) {
    return "I couldn't find matches for that. Try a broader genre or a different title.";
  }
  return filters.replyText?.trim() || "Here are some movies you might enjoy.";
}

async function findWithFallback(filters) {
  let matches = await filterMovies(filters);
  if (matches.length) {
    return { replyText: buildReply(filters, matches), movies: matches };
  }

  const relaxed = { ...filters, genres: [...(filters.genres || [])] };
  if (relaxed.minRating != null) {
    relaxed.minRating = null;
    matches = await filterMovies(relaxed);
    if (matches.length) {
      return { replyText: "I widened the search a bit. Here are some matches.", movies: matches };
    }
  }

  if (relaxed.yearFrom != null || relaxed.yearTo != null) {
    relaxed.yearFrom = null;
    relaxed.yearTo = null;
    matches = await filterMovies(relaxed);
    if (matches.length) {
      return { replyText: "I broadened the year range. Try these picks.", movies: matches };
    }
  }

  if (relaxed.genres?.length) {
    relaxed.genres = [];
    matches = await filterMovies(relaxed);
    if (matches.length) {
      return { replyText: "No direct genre match, so here are popular options.", movies: matches };
    }
  }

  if (relaxed.query?.trim()) {
    relaxed.query = null;
    matches = await filterMovies(relaxed);
    if (matches.length) {
      return { replyText: "No exact title match, but these are great picks.", movies: matches };
    }
  }

  const fallback = await Movie.find().sort({ rating: -1 }).limit(10);
  return { replyText: "I couldn't find a close match, so here are top-rated picks.", movies: fallback };
}

export async function getRecommendations(userMessage) {
  if (!userMessage?.trim()) {
    return { replyText: "Tell me a genre, mood, or a movie you like.", movies: [] };
  }

  if (!(process.env.GROQ_API_KEY || "").trim()) {
    return {
      replyText: "AI recommendations are not configured yet. Please set GROQ_API_KEY on the server.",
      movies: [],
    };
  }

  const filters = await callGroqForFilters(userMessage) || fromQuery(userMessage);
  return findWithFallback(filters);
}
