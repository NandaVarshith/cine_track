function HeroBanner({ movie }) {
  return (
    <section className="hero-banner">
      <img src={movie.backdrop} alt="Featured movie" />
      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-kicker">Featured tonight</p>
        <h1>{movie.title}</h1>
        <p className="hero-desc">{movie.description}</p>
        <p className="hero-rating">Movie rating {movie.rating}</p>
        <div className="hero-actions">
          <button type="button" className="primary-btn">
            Watch Trailer
          </button>
          <button type="button" className="secondary-btn">
            Add to Wishlist
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
