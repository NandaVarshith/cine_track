import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api/client.js";
import MovieCard from "../components/home/MovieCard.jsx";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNav from "../components/home/HomeNav.jsx";
import "../src/index.css";

const MOVIES_PER_PAGE = 8;

const trendingFilterOptions = [
  { id: "all", label: "All Movies" },
  { id: "trending", label: "Trending" },
  { id: "popular", label: "Popular" },
  { id: "top-rated", label: "Top Rated" },
];

function TrendingPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [movies, setMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_PAGE);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        let endpoint = "/api/movies"; // Default for 'all'
        if (activeFilter !== "all") {
          endpoint = `/api/movies/${activeFilter}`;
        }
        const response = await api.get(endpoint);
        setMovies(response.data);
      } catch (error) {
        console.error(`Error fetching ${activeFilter} movies:`, error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [activeFilter]);

  const visibleMovies = useMemo(
    () => movies.slice(0, visibleCount),
    [movies, visibleCount],
  );

  const canLoadMore = visibleCount < movies.length;

  function handleFilterChange(filterId) {
    setActiveFilter(filterId);
    setVisibleCount(MOVIES_PER_PAGE);
  }

  function handleViewDetails(movie) {
    navigate(`/movie/${movie.id || "eclipse-protocol"}`);
  }

  async function handleAddToWishlist(movie) {
    if (!movie?.id) {
      console.error("Missing movie id for wishlist.");
      return;
    }
    try {
      await api.post(
        "/api/watchlist",
        { movieId: movie.id, status: "PLANNED" },
        { withCredentials: true }
      );
      setWishlistIds((prev) => (prev.includes(movie.id) ? prev : [...prev, movie.id]));
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth/login");
        return;
      }
      console.error("Error adding to wishlist:", error);
    }
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + MOVIES_PER_PAGE);
  }

  return (
    <main className="cinetrack-page">
      <HomeNav />

      <section className="section-block trending-header">
        <h1>Trending Movies</h1>
        <p>Discover the movies everyone is watching right now.</p>
      </section>

      <section className="section-block">
        <div className="trending-filters" role="tablist" aria-label="Trending filters">
          {trendingFilterOptions.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`ghost-btn ${activeFilter === filter.id ? "is-active" : ""}`}
              onClick={() => handleFilterChange(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="section-empty">Loading movies...</p>
        ) : visibleMovies.length === 0 ? (
          <p className="section-empty">No movies found for this filter.</p>
        ) : (
          <div className="trending-grid">
            {visibleMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                primaryActionText="View Details"
                onPrimaryAction={handleViewDetails}
                secondaryActionText={
                  wishlistIds.includes(movie.id) ? "Added to Wishlist" : "Add to Wishlist"
                }
                onSecondaryAction={handleAddToWishlist}
              />
            ))}
          </div>
        )}

        {canLoadMore && (
          <div className="trending-load-wrap">
            <button type="button" className="primary-btn" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )}
      </section>

      <HomeFooter />
    </main>
  );
}

export default TrendingPage;
