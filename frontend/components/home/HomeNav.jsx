import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function HomeNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchTerm("");
      return;
    }
    const query = new URLSearchParams(location.search).get("query") || "";
    setSearchTerm(query);
  }, [location.pathname, location.search]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      navigate("/search");
      return;
    }
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className="top-nav">
      <Link className="logo" to="/" aria-label="CineTrack home">
        <span>Cine</span>Track
      </Link>

      <form className="search-wrap" role="search" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search movies or genres"
          aria-label="Search movies"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </form>

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
