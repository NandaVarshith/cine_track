import { useNavigate, useParams } from "react-router-dom";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNav from "../components/home/HomeNav.jsx";
import MovieStrip from "../components/home/MovieStrip.jsx";
import "../src/index.css";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const response = await axios.get(`http://localhost:8080/api/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }

    fetchMovieDetails();
  }, [id]);

  const genres = useMemo(() => {
    if (!movie?.genre) return [];
    return movie.genre.split(",").map((value) => value.trim()).filter(Boolean);
  }, [movie]);

  function handleViewDetails(selectedMovie) {
    navigate(`/movie/${selectedMovie.id || "eclipse-protocol"}`);
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
        <div className="review-list">
          {movie.reviews?.map((review) => (
            <article className="review-card" key={review.user}>
              <div className="review-avatar">{review.user.slice(0, 2).toUpperCase()}</div>
              <div className="review-content">
                <h3>{review.user}</h3>
                <p className="review-rating">? {review.rating} / 5</p>
                <p>{review.comment}</p>
              </div>
            </article>
          )) || null}
        </div>
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
