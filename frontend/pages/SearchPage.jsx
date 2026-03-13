import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../src/api/client.js";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNav from "../components/home/HomeNav.jsx";
import MovieCard from "../components/home/MovieCard.jsx";
import "../src/index.css";

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get("query") || "";
  const trimmedQuery = useMemo(() => rawQuery.trim(), [rawQuery]);

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function fetchResults() {
      if (!trimmedQuery) {
        setResults([]);
        setErrorMessage("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get("/api/movies/search", {
          params: { query: trimmedQuery },
        });
        if (!ignore) {
          setResults(response.data || []);
        }
      } catch (error) {
        if (!ignore) {
          setResults([]);
          setErrorMessage("Unable to search movies right now. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchResults();

    return () => {
      ignore = true;
    };
  }, [trimmedQuery]);

  function handleViewDetails(movie) {
    navigate(`/movie/${movie.id || "eclipse-protocol"}`);
  }

  async function handleAddToWishlist(movie) {
    if (!movie?.id) {
      console.error("Missing movie id for wishlist.");
      return;
    }
    if (wishlistIds.includes(movie.id)) {
      return;
    }
    try {
      await api.post(
        "/api/watchlist",
        { movieId: movie.id, status: "PLANNED" },
        { withCredentials: true }
      );
      setWishlistIds((prev) => [...prev, movie.id]);
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth/login");
        return;
      }
      console.error("Error adding to wishlist:", error);
    }
  }

  const hasQuery = Boolean(trimmedQuery);
  const isEmpty = hasQuery && !isLoading && !errorMessage && results.length === 0;

  return (
    <main className="cinetrack-page">
      <HomeNav />

      <section className="section-block search-header">
        <h1>Search</h1>
        {hasQuery ? (
          <p>
            Results for <span className="search-term">"{trimmedQuery}"</span>
          </p>
        ) : (
          <p>Type a movie title or genre to get started.</p>
        )}
      </section>

      <section className="section-block">
        {isLoading && <p className="search-status">Searching titles...</p>}

        {!isLoading && errorMessage && (
          <p className="search-status is-error">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && !hasQuery && (
          <div className="search-empty">
            <p>Your search results will show up here.</p>
            <p>Try searching for something like "Action" or "Inception".</p>
          </div>
        )}

        {isEmpty && (
          <div className="search-empty">
            <p>No matches for "{trimmedQuery}".</p>
            <p>Try another keyword or a broader genre.</p>
          </div>
        )}

        {!isLoading && !errorMessage && results.length > 0 && (
          <div className="search-grid">
            {results.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                primaryActionText={
                  wishlistIds.includes(movie.id) ? "Added to Wishlist" : "Add to Wishlist"
                }
                onPrimaryAction={handleAddToWishlist}
                secondaryActionText="View Details"
                onSecondaryAction={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      <HomeFooter />
    </main>
  );
}

export default SearchPage;
