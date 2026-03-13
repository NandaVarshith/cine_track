import { useNavigate, useParams } from "react-router-dom";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNav from "../components/home/HomeNav.jsx";
import MovieStrip from "../components/home/MovieStrip.jsx";
import "../src/index.css";
import { api } from "../src/api/client.js";
import { useEffect, useMemo, useState } from "react";

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [watchStatus, setWatchStatus] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: "8", comment: "" });
  const [reviewStatus, setReviewStatus] = useState({ loading: false, error: "" });

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const response = await api.get(`/api/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await api.get(`/api/reviews/movie/${id}`);
        setReviews(response.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    if (id) {
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    async function fetchWatchStatus() {
      try {
        const response = await api.get(`/api/watchlist/status/${id}`, {
          withCredentials: true,
        });
        setWatchStatus(response.data?.status || "");
      } catch (error) {
        if (error?.response?.status === 404) {
          setWatchStatus("");
        }
      }
    }

    if (id) {
      fetchWatchStatus();
    }
  }, [id]);

  const genres = useMemo(() => {
    if (!movie?.genre) return [];
    return movie.genre.split(",").map((value) => value.trim()).filter(Boolean);
  }, [movie]);

  function handleViewDetails(selectedMovie) {
    navigate(`/movie/${selectedMovie.id || "eclipse-protocol"}`);
  }

  async function handleAddToWishlist() {
    try {
      await api.post(
        "/api/watchlist",
        { movieId: id, status: "PLANNED" },
        { withCredentials: true }
      );
      setWatchStatus("PLANNED");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth/login");
      }
    }
  }

  async function handleMarkWatched() {
    try {
      await api.patch(
        `/api/watchlist/${id}`,
        { status: "WATCHED" },
        { withCredentials: true }
      );
      setWatchStatus("WATCHED");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth/login");
      }
    }
  }

  function handleReviewChange(event) {
    const { name, value } = event.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmitReview(event) {
    event.preventDefault();
    setReviewStatus({ loading: true, error: "" });
    try {
      const response = await api.post(
        "/api/reviews",
        {
          movieId: id,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        },
        { withCredentials: true }
      );
      const saved = response.data;
      setReviews((prev) => {
        const filtered = prev.filter((review) => review.id !== saved.id);
        return [saved, ...filtered];
      });
      setReviewForm({ rating: reviewForm.rating, comment: "" });
      setReviewStatus({ loading: false, error: "" });
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth/login");
        return;
      }
      setReviewStatus({
        loading: false,
        error: error?.response?.data?.message || "Unable to submit review.",
      });
    }
  }

  if (!movie) {
    return (
      <main className="cinetrack-page">
        <HomeNav />
        <section className="details-hero">
          <div className="details-hero-content">
            <h1>Loading...</h1>
          </div>
        </section>
        <HomeFooter />
      </main>
    );
  }

  return (
    <main className="cinetrack-page">
      <HomeNav />

      <section className="details-hero">
        <img src={movie.poster_url} alt={`${movie.title} poster`} />
        <div className="details-hero-overlay" />
        <div className="details-hero-content">
          <h1>{movie.title}</h1>
          <div className="details-meta">
            <span>{movie.releaseYear}</span>
            <span>? {movie.rating}</span>
            <span>{movie.runtime} min</span>
            <span>{movie.country}</span>
          </div>
          <div className="tag-wrap">
            {genres.map((tag) => (
              <span key={`${movie.id || movie.imdb_id}-${tag}`}>{tag}</span>
            ))}
          </div>
          <p className="details-short">{movie.overview}</p>
          <div className="hero-actions">
            <button type="button" className="primary-btn">
              Watch Trailer
            </button>
            <button type="button" className="secondary-btn" onClick={handleAddToWishlist}>
              {watchStatus ? "In Wishlist" : "Add to Wishlist"}
            </button>
            <button type="button" className="secondary-btn" onClick={handleMarkWatched}>
              {watchStatus === "WATCHED" ? "Watched" : "Mark as Watched"}
            </button>
          </div>
        </div>
      </section>

      <section className="details-overview">
        <article className="details-poster-card">
          <img src={movie.poster_url} alt={`${movie.title} poster`} />
        </article>
        <article className="details-info-card">
          <h2>Movie Overview</h2>
          <p>{movie.overview}</p>
          <div className="details-info-grid">
            <p>
              <strong>Release Year:</strong> {movie.releaseYear}
            </p>
            <p>
              <strong>Language:</strong> {movie.language}
            </p>
            <p>
              <strong>Votes:</strong> {movie.votes}
            </p>
            <p>
              <strong>Genres:</strong> {genres.join(", ")}
            </p>
          </div>
        </article>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>Cast</h2>
        </div>
        <div className="cast-strip">
          {movie.cast?.map((actor) => (
            <article className="cast-card" key={`${actor.name}-${actor.character}`}>
              <img src={actor.photo} alt={actor.name} loading="lazy" />
              <div className="cast-card-content">
                <h3>{actor.name}</h3>
                <p>{actor.character}</p>
              </div>
            </article>
          )) || null}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>User Reviews</h2>
        </div>
        <form className="review-form" onSubmit={handleSubmitReview}>
          <label>
            Rating (1-10)
            <select
              name="rating"
              value={reviewForm.rating}
              onChange={handleReviewChange}
            >
              <option value="10">10 - Masterpiece</option>
              <option value="9">9 - Amazing</option>
              <option value="8">8 - Great</option>
              <option value="7">7 - Good</option>
              <option value="6">6 - Decent</option>
              <option value="5">5 - Average</option>
              <option value="4">4 - Below Average</option>
              <option value="3">3 - Poor</option>
              <option value="2">2 - Bad</option>
              <option value="1">1 - Terrible</option>
            </select>
          </label>
          <label>
            Your Review
            <textarea
              name="comment"
              rows="3"
              placeholder="Share your thoughts..."
              value={reviewForm.comment}
              onChange={handleReviewChange}
            />
          </label>
          {reviewStatus.error && <p className="review-error">{reviewStatus.error}</p>}
          <button
            type="submit"
            className="primary-btn"
            disabled={reviewStatus.loading || reviewForm.comment.trim().length === 0}
          >
            {reviewStatus.loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {reviews.length === 0 ? (
          <p className="review-empty">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="review-list">
            {reviews.map((review) => (
              <article className="review-card" key={review.id || review.userId}>
                <div className="review-avatar">
                  {(review.userName || "User").slice(0, 2).toUpperCase()}
                </div>
                <div className="review-content">
                  <h3>{review.userName || "User"}</h3>
                  <p className="review-rating">Rating {review.rating} / 10</p>
                  <p>{review.comment}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <MovieStrip
        title="Similar Movies"
        movies={movie.similarMovies || []}
        showSectionAction={false}
        onViewDetails={handleViewDetails}
      />

      <HomeFooter />
    </main>
  );
}

export default MovieDetailsPage;
