export const trendingFilterOptions = [
  { id: "all", label: "All" },
  { id: "this-week", label: "This Week" },
  { id: "top-rated", label: "Top Rated" },
  { id: "most-popular", label: "Most Popular" },
];

const allTrendingMovies = [
  {
    id: "eclipse-protocol",
    title: "Eclipse Protocol",
    rating: "8.9",
    poster:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "last-signal",
    title: "Last Signal",
    rating: "8.4",
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "neon-frontier",
    title: "Neon Frontier",
    rating: "8.7",
    poster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "silent-orbit",
    title: "Silent Orbit",
    rating: "8.1",
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "ashes-of-tomorrow",
    title: "Ashes of Tomorrow",
    rating: "8.6",
    poster:
      "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "chronicle-2049",
    title: "Chronicle 2049",
    rating: "9.0",
    poster:
      "https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "moonline",
    title: "Moonline",
    rating: "8.3",
    poster:
      "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "frostline",
    title: "Frostline",
    rating: "8.5",
    poster:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "obsidian-code",
    title: "Obsidian Code",
    rating: "8.8",
    poster:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "solaris-run",
    title: "Solaris Run",
    rating: "8.2",
    poster:
      "https://images.unsplash.com/photo-1608889825271-9696287ab804?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "echo-district",
    title: "Echo District",
    rating: "8.0",
    poster:
      "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "black-tides",
    title: "Black Tides",
    rating: "8.4",
    poster:
      "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?auto=format&fit=crop&w=500&q=80",
  },
];

const filterMovieIds = {
  "this-week": [
    "eclipse-protocol",
    "last-signal",
    "neon-frontier",
    "silent-orbit",
    "chronicle-2049",
    "obsidian-code",
    "black-tides",
  ],
  "top-rated": [
    "chronicle-2049",
    "eclipse-protocol",
    "obsidian-code",
    "neon-frontier",
    "ashes-of-tomorrow",
    "frostline",
  ],
  "most-popular": [
    "eclipse-protocol",
    "last-signal",
    "chronicle-2049",
    "moonline",
    "solaris-run",
    "echo-district",
    "black-tides",
  ],
};

export function getTrendingMoviesByFilter(filterId) {
  if (filterId === "all") {
    return allTrendingMovies;
  }

  const ids = filterMovieIds[filterId] || [];
  return allTrendingMovies.filter((movie) => ids.includes(movie.id));
}
