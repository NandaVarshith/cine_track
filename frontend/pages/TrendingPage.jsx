import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/home/MovieCard.jsx";
import { HomeFooter, HomeNav } from "../components/home/index.js";
import {
  getTrendingMoviesByFilter,
  trendingFilterOptions,
} from "../components/trending/trendingData.js";
import "../src/index.css";

const MOVIES_PER_PAGE = 8;

function TrendingPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_PAGE);
  const [wishlistIds, setWishlistIds] = useState([]);

  const filteredMovies = useMemo(
    () => getTrendingMoviesByFilter(activeFilter),
    [activeFilter],
  );
  const visibleMovies = useMemo(
    () => filteredMovies.slice(0, visibleCount),
    [filteredMovies, visibleCount],
  );

  const canLoadMore = visibleCount < filteredMovies.length;

  function handleFilterChange(filterId) {
    setActiveFilter(filterId);
    setVisibleCount(MOVIES_PER_PAGE);
  }

  function handleViewDetails(movie) {
    navigate(`/movie/${movie.id || "eclipse-protocol"}`);
  }

  function handleAddToWishlist(movie) {
    setWishlistIds((prev) => (prev.includes(movie.id) ? prev : [...prev, movie.id]));
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
