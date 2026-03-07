import { useState } from "react";

function shouldAnimateWishlist(actionText) {
  return /wishlist/i.test(actionText) && /add/i.test(actionText);
}

function MovieCard({
  movie,
  primaryActionText = "Add to wishlist",
  onPrimaryAction = () => {},
  secondaryActionText = "View details",
  onSecondaryAction = () => {},
}) {
  const [heartBurstId, setHeartBurstId] = useState(0);

  function handlePrimaryAction() {
    if (shouldAnimateWishlist(primaryActionText)) {
      setHeartBurstId((prev) => prev + 1);
    }
    onPrimaryAction(movie);
  }

  function handleSecondaryAction() {
    if (shouldAnimateWishlist(secondaryActionText)) {
      setHeartBurstId((prev) => prev + 1);
    }
    onSecondaryAction(movie);
  }

  return (
    <article className="movie-card">
      <img src={movie.poster} alt={movie.title} loading="lazy" />
      {heartBurstId > 0 && (
        <div key={heartBurstId} className="movie-heart-burst" aria-hidden="true">
          <span>{"\u2665"}</span>
        </div>
      )}
      <div className="movie-overlay">
        <button type="button" onClick={handlePrimaryAction}>
          {primaryActionText}
        </button>
        <button type="button" onClick={handleSecondaryAction}>
          {secondaryActionText}
        </button>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>Rating {movie.rating}</p>
      </div>
    </article>
  );
}

export default MovieCard;
