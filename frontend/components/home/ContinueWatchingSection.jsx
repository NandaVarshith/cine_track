function ContinueWatchingSection({ items, onResume = () => {} }) {
  if (!items || items.length === 0) {
    return (
      <section className="section-block">
        <div className="section-head">
          <h2>Continue Watching</h2>
        </div>
        <p className="profile-empty">No recent progress yet.</p>
      </section>
    );
  }

  return (
    <section className="section-block">
      <div className="section-head">
        <h2>Continue Watching</h2>
      </div>

      <div className="continue-grid">
        {items.map((item) => (
          <article className="continue-card" key={item.movieId}>
            <img src={item.movie.poster_url} alt={item.movie.title} loading="lazy" />
            <div className="continue-content">
              <h3>{item.movie.title}</h3>
              <div className="progress-track">
                <span style={{ width: `${item.progressPercent}%` }} />
              </div>
              <p>{item.progressPercent}% watched</p>
              <button type="button" onClick={() => onResume(item)}>
                Resume
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ContinueWatchingSection;
