function ContinueWatchingSection({ movies }) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>Continue Watching</h2>
      </div>

      <div className="continue-grid">
        {movies.map((movie) => (
          <article className="continue-card" key={movie.title}>
            <img src={movie.poster} alt={movie.title} loading="lazy" />
            <div className="continue-content">
              <h3>{movie.title}</h3>
              <div className="progress-track">
                <span style={{ width: `${movie.progress}%` }} />
              </div>
              <p>{movie.progress}% watched</p>
              <button type="button">Resume</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ContinueWatchingSection;
