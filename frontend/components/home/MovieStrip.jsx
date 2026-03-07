import MovieCard from "./MovieCard.jsx";

function MovieStrip({
  title,
  movies,
  actionText = "View all",
  onViewDetails = () => {},
  showSectionAction = true,
}) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>{title}</h2>
        {showSectionAction && (
          <button className="ghost-btn" type="button">
            {actionText}
          </button>
        )}
      </div>

      <div className="movie-strip">
        {movies.map((movie) => (
          <MovieCard
            key={`${title}-${movie.title}`}
            movie={movie}
            onSecondaryAction={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieStrip;
