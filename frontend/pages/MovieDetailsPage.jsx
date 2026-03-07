import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HomeFooter, HomeNav, MovieStrip } from "../components/home/index.js";
import { getMovieById } from "../components/movie-details/movieDetailsData.js";
import "../src/index.css";

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = useMemo(() => getMovieById(id), [id]);

  function handleViewDetails(selectedMovie) {
    navigate(`/movie/${selectedMovie.id || "eclipse-protocol"}`);
  }

  return (
    <main className="cinetrack-page">
      <HomeNav />

      <section className="details-hero">
        <img src={movie.backdrop} alt={`${movie.title} backdrop`} />
        <div className="details-hero-overlay" />
        <div className="details-hero-content">
          <h1>{movie.title}</h1>
          <div className="details-meta">
            <span>{movie.year}</span>
            <span>⭐ {movie.rating}</span>
            <span>{movie.duration}</span>
            <span>Director: {movie.director}</span>
          </div>
          <div className="tag-wrap">
            {movie.genres.map((tag) => (
              <span key={`${movie.id}-${tag}`}>{tag}</span>
            ))}
          </div>
          <p className="details-short">{movie.shortDescription}</p>
          <div className="hero-actions">
            <button type="button" className="primary-btn">
              Watch Trailer
            </button>
            <button type="button" className="secondary-btn">
              Add to Wishlist
            </button>
            <button type="button" className="secondary-btn">
              Mark as Watched
            </button>
          </div>
        </div>
      </section>

      <section className="details-overview">
        <article className="details-poster-card">
          <img src={movie.poster} alt={`${movie.title} poster`} />
        </article>
        <article className="details-info-card">
          <h2>Movie Overview</h2>
          <p>{movie.overview}</p>
          <div className="details-info-grid">
            <p>
              <strong>Release Year:</strong> {movie.year}
            </p>
            <p>
              <strong>Language:</strong> {movie.language}
            </p>
            <p>
              <strong>Director:</strong> {movie.director}
            </p>
            <p>
              <strong>Genres:</strong> {movie.genres.join(", ")}
            </p>
          </div>
        </article>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>Cast</h2>
        </div>
        <div className="cast-strip">
          {movie.cast.map((actor) => (
            <article className="cast-card" key={`${actor.name}-${actor.character}`}>
              <img src={actor.photo} alt={actor.name} loading="lazy" />
              <div className="cast-card-content">
                <h3>{actor.name}</h3>
                <p>{actor.character}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>User Reviews</h2>
        </div>
        <div className="review-list">
          {movie.reviews.map((review) => (
            <article className="review-card" key={review.user}>
              <div className="review-avatar">{review.user.slice(0, 2).toUpperCase()}</div>
              <div className="review-content">
                <h3>{review.user}</h3>
                <p className="review-rating">⭐ {review.rating} / 5</p>
                <p>{review.comment}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <MovieStrip
        title="Similar Movies"
        movies={movie.similarMovies}
        showSectionAction={false}
        onViewDetails={handleViewDetails}
      />

      <HomeFooter />
    </main>
  );
}

export default MovieDetailsPage;
