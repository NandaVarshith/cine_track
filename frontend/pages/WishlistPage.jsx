import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeFooter, HomeNav } from "../components/home/index.js";
import MovieCard from "../components/home/MovieCard.jsx";
import "../src/index.css";

const initialWishlistMovies = [
  {
    id: "eclipse-protocol",
    title: "Eclipse Protocol",
    rating: "8.9",
    poster:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
    watched: true,
  },
  {
    id: "last-signal",
    title: "Last Signal",
    rating: "8.4",
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80",
    watched: false,
  },
  {
    id: "neon-frontier",
    title: "Neon Frontier",
    rating: "8.7",
    poster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=500&q=80",
    watched: false,
  },
  {
    id: "silent-orbit",
    title: "Silent Orbit",
    rating: "8.1",
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80",
    watched: true,
  },
];

function WishlistPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [wishlistMovies, setWishlistMovies] = useState(initialWishlistMovies);

  const filteredMovies = useMemo(() => {
    if (activeFilter === "watched") {
      return wishlistMovies.filter((movie) => movie.watched);
    }

    if (activeFilter === "not-watched") {
      return wishlistMovies.filter((movie) => !movie.watched);
    }

    return wishlistMovies;
  }, [activeFilter, wishlistMovies]);

  function handleRemoveFromWishlist(movie) {
    setWishlistMovies((prev) => prev.filter((item) => item.id !== movie.id));
  }

  function handleViewDetails(movie) {
    navigate(`/movie/${movie.id || "eclipse-protocol"}`);
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
            className={`ghost-btn ${activeFilter === "not-watched" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("not-watched")}
          >
            Not Watched
          </button>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="wishlist-empty">
            <p>No movies in your wishlist yet.</p>
            <button type="button" className="primary-btn" onClick={() => navigate("/")}>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                primaryActionText="Remove from Wishlist"
                onPrimaryAction={handleRemoveFromWishlist}
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

export default WishlistPage;
