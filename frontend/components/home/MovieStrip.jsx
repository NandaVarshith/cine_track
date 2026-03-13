import MovieCard from "./MovieCard.jsx";

function MovieStrip({
  title,
  movies,
  actionText = "View all",
  onViewDetails = () => {},
  onAddToWishlist = () => {},
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
            key={movie.id}
            movie={movie}
            onPrimaryAction={onAddToWishlist}
            onSecondaryAction={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieStrip;
