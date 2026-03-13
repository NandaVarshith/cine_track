import MovieCard from "./MovieCard.jsx";

function MovieStrip({
  title,
  movies,
  actionText = "View all",
  onViewDetails = () => {},
  onAddToWishlist = () => {},
  onSectionAction,
  showSectionAction = true,
  isLoading = false,
  emptyMessage = "No movies to show here yet.",
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

      {isLoading ? (
        <p className="section-empty">Loading {title.toLowerCase()}...</p>
      ) : hasMovies ? (
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
        <p className="section-empty">{emptyMessage}</p>
      )}
    </section>
  );
}

export default MovieStrip;
