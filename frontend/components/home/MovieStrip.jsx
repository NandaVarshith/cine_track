import MovieCard from "./MovieCard.jsx";

function MovieStrip({
  title,
  movies,
  actionText = "View all",
  onViewDetails = () => {},
  onAddToWishlist = () => {},
  onSectionAction,
  showSectionAction = true,
}) {
  const hasMovies = Array.isArray(movies) && movies.length > 0;
  const shouldShowAction = showSectionAction && typeof onSectionAction === "function";

  return (
    <section className="section-block">
      <div className="section-head">
        <h2>{title}</h2>
        {shouldShowAction && (
          <button className="ghost-btn" type="button" onClick={onSectionAction}>
            {actionText}
          </button>
        )}
      </div>

      {hasMovies ? (
        <div className="movie-strip">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPrimaryAction={onAddToWishlist}
              onSecondaryAction={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <p className="section-empty">No movies to show here yet.</p>
      )}
    </section>
  );
}

export default MovieStrip;
