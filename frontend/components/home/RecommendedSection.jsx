function RecommendedSection({ movies }) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>Recommended For You</h2>
        <button className="ghost-btn" type="button">
          Refresh picks
        </button>
      </div>

      <div className="recommend-grid">
        {movies.map((movie) => (
          <article className="recommend-card" key={movie.title}>
            <img src={movie.poster} alt={movie.title} loading="lazy" />
            <div className="recommend-content">
              <div>
                <h3>{movie.title}</h3>
                <p>Rating {movie.rating}</p>
              </div>
              <div className="tag-wrap">
                {movie.genre.map((tag) => (
                  <span key={`${movie.title}-${tag}`}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendedSection;
