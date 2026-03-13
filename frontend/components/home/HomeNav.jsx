import { Link } from "react-router-dom";

function HomeNav() {
  return (
    <header className="top-nav">
      <Link className="logo" to="/" aria-label="CineTrack home">
        <span>Cine</span>Track
      </Link>

      <div className="search-wrap">
        <input
          type="search"
          placeholder="Search movies, genres, actors"
          aria-label="Search movies"
        />
      </div>

      <nav className="menu-links" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/trending">Trending</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/chatbot">Chatbot</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/auth/login">Login</Link>
      </nav>

      <Link className="avatar-btn" to="/profile" aria-label="Open profile">
        CT
      </Link>
    </header>
  );
}

export default HomeNav;
