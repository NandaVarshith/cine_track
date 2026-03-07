import { trendingMovies } from "../home/homeData.js";

export const movieDetailsData = {
  "eclipse-protocol": {
    id: "eclipse-protocol",
    title: "Eclipse Protocol",
    rating: "8.9",
    year: "2026",
    language: "English",
    director: "Elena Ward",
    genres: ["Sci-Fi", "Thriller", "Mystery"],
    duration: "2h 14m",
    backdrop:
      "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1800&q=80",
    poster:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=700&q=80",
    shortDescription:
      "A cryptic transmission buried in archival films reveals a conspiracy spanning three decades.",
    overview:
      "When an elite audio restoration engineer discovers encrypted military signals inside damaged celluloid, she becomes the only person able to decode a mission erased from history. Every recovered frame pushes her deeper into a covert network that refuses to stay in the past.",
    cast: [
      {
        name: "Ava Sterling",
        character: "Dr. Elara Voss",
        photo:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Liam Brooks",
        character: "Commander Reid",
        photo:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Mia Laurent",
        character: "Agent Sol",
        photo:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Noah Kim",
        character: "Iris Architect",
        photo:
          "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=400&q=80",
      },
    ],
    reviews: [
      {
        user: "cinepulse",
        rating: "4.8",
        comment:
          "Gorgeous visuals and smart pacing. The sound design alone is worth the watch.",
      },
      {
        user: "moviebyte",
        rating: "4.5",
        comment: "Great lead performance and world-building. Ending hit hard.",
      },
      {
        user: "nightwatch",
        rating: "4.6",
        comment: "A tense thriller with a very polished production feel.",
      },
    ],
    similarMovies: trendingMovies,
  },
};

export function getMovieById(movieId) {
  return movieDetailsData[movieId] || movieDetailsData["eclipse-protocol"];
}
