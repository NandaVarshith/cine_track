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
            <img src={movie.poster_url} alt={movie.title} loading="lazy" />
            <div className="recommend-content">
              <div>
                <h3>{movie.title}</h3>
                <p>Rating {movie.rating}</p>
              </div>
              <div className="tag-wrap">
                
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendedSection;
