import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api/client.js";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNav from "../components/home/HomeNav.jsx";
import MovieCard from "../components/home/MovieCard.jsx";
import "../src/index.css";

function WishlistPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  const filteredMovies = useMemo(() => {
    if (activeFilter === "watched") {
      return watchlistItems.filter((item) => item.status === "WATCHED");
    }
    if (activeFilter === "planned") {
      return watchlistItems.filter((item) => item.status === "PLANNED");
    }
    if (activeFilter === "dropped") {
      return watchlistItems.filter((item) => item.status === "DROPPED");
    }
    return watchlistItems;
  }, [activeFilter, watchlistItems]);

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const response = await api.get("/api/watchlist", {
          withCredentials: true,
        });
        setWatchlistItems(response.data || []);
        setStatusMessage("");
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate("/auth/login");
        } else {
          setStatusMessage("Unable to load your wishlist. Please try again.");
        }
      }
    }

    fetchWatchlist();
  }, [navigate]);

  async function handleRemoveFromWishlist(item) {
    try {
      await api.delete(`/api/watchlist/${item.movieId}`, {
        withCredentials: true,
      });
      setWatchlistItems((prev) => prev.filter((entry) => entry.movieId !== item.movieId));
      setStatusMessage("");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth/login");
      } else {
        setStatusMessage("Unable to remove this movie. Please try again.");
      }
    }
  }

  function handleViewDetails(item) {
    navigate(`/movie/${item.movie?.id || item.movieId || "eclipse-protocol"}`);
  }

  async function handleUpdateStatus(item, status) {
    try {
      const response = await api.patch(
        `/api/watchlist/${item.movieId}`,
        { status },
        { withCredentials: true }
      );
      setWatchlistItems((prev) =>
        prev.map((entry) =>
          entry.movieId === item.movieId ? { ...entry, status: response.data.status } : entry
        )
      );
      setStatusMessage("");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth/login");
      } else {
        setStatusMessage("Unable to update status. Please try again.");
      }
    }
  }

  return (
    <main className="cinetrack-page">
      <HomeNav />

      <section className="section-block wishlist-header">
        <h1>My Wishlist</h1>
        <p>Movies you saved to watch later.</p>
      </section>

      <section className="section-block">
        <div className="wishlist-filters" role="tablist" aria-label="Wishlist filter">
          <button
            type="button"
            className={`ghost-btn ${activeFilter === "all" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`ghost-btn ${activeFilter === "watched" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("watched")}
          >
            Watched
          </button>
          <button
            type="button"
            className={`ghost-btn ${activeFilter === "planned" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("planned")}
          >
            Planned
          </button>
          <button
            type="button"
            className={`ghost-btn ${activeFilter === "dropped" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("dropped")}
          >
            Dropped
          </button>
        </div>

        {statusMessage && <p className="wishlist-status-message">{statusMessage}</p>}

        {filteredMovies.length === 0 ? (
          <div className="wishlist-empty">
            <p>No movies in your wishlist yet.</p>
            <button type="button" className="primary-btn" onClick={() => navigate("/")}>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {filteredMovies.map((item) => (
              <div key={item.movieId} className="wishlist-card">
                <MovieCard
                  movie={item.movie}
                  primaryActionText="Remove from Wishlist"
                  onPrimaryAction={() => handleRemoveFromWishlist(item)}
                  secondaryActionText="View Details"
                  onSecondaryAction={() => handleViewDetails(item)}
                />
                <div className="wishlist-card-actions">
                  <span className="wishlist-status-pill">
                    Status: {item.status || "PLANNED"}
                  </span>
                  <div className="wishlist-action-row">
                    {item.status !== "WATCHED" && (
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => handleUpdateStatus(item, "WATCHED")}
                      >
                        Mark Watched
                      </button>
                    )}
                    {item.status !== "PLANNED" && (
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => handleUpdateStatus(item, "PLANNED")}
                      >
                        Move to Planned
                      </button>
                    )}
                    {item.status !== "DROPPED" && (
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => handleUpdateStatus(item, "DROPPED")}
                      >
                        Mark Dropped
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <HomeFooter />
    </main>
  );
}

export default WishlistPage;
