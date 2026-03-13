function RecommendedSection({ movies, onRefresh }) {
  const hasMovies = Array.isArray(movies) && movies.length > 0;
  const canRefresh = typeof onRefresh === "function";

  return (
    <section className="section-block">
      <div className="section-head">
        <h2>Recommended For You</h2>
        {canRefresh && (
          <button className="ghost-btn" type="button" onClick={onRefresh}>
            Refresh picks
          </button>
        )}
      </div>

      {hasMovies ? (
        <div className="recommend-grid">
          {movies.map((movie) => (
            <article className="recommend-card" key={movie.title}>
              <img src={movie.poster_url} alt={movie.title} loading="lazy" />
              <div className="recommend-content">
                <div>
                  <h3>{movie.title}</h3>
                  <p>Rating {movie.rating ?? "N/A"}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="section-empty">No recommendations yet.</p>
      )}
    </section>
  );
}

export default RecommendedSection;
