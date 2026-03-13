import "../src/index.css";
import { useNavigate } from "react-router-dom";
import ChatbotSection from "../components/home/ChatbotSection.jsx";
import ContinueWatchingSection from "../components/home/ContinueWatchingSection.jsx";
import HeroBanner from "../components/home/HeroBanner.jsx";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNav from "../components/home/HomeNav.jsx";
import MovieStrip from "../components/home/MovieStrip.jsx";
import RecommendedSection from "../components/home/RecommendedSection.jsx";
import { api } from "../src/api/client.js";
import { useEffect, useState } from "react";
import { featuredMovie } from "../components/home/homeData.js";

function Home() {
  const navigate = useNavigate();

  function handleViewDetails(movie) {
    navigate(`/movie/${movie.id || "eclipse-protocol"}`);
  }

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [categoryRows, setCategoryRows] = useState({});
  const [continueItems, setContinueItems] = useState([]);

  async function fetchTrendingMovies() {
    try {
      const response = await api.get("/api/movies/trending");
      setTrendingMovies(response.data);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  }

  async function fetchRecommendedMovies() {
    try {
      const response = await api.get("/api/movies/recommended");
      setRecommendedMovies(response.data);
    } catch (error) {
      console.error("Error fetching recommended movies:", error);
    }
  }

  async function fetchCategoryRows() {
    try {
      const response = await api.get("/api/movies/categories");
      setCategoryRows(response.data);
    } catch (error) {
      console.error("Error fetching category rows:", error);
    }
  }

  async function fetchContinueWatching() {
    try {
      const response = await api.get("/api/progress", { withCredentials: true });
      setContinueItems(response.data || []);
    } catch (error) {
      if (error?.response?.status === 401) {
        setContinueItems([]);
        return;
      }
      console.error("Error fetching continue watching:", error);
    }
  }

  async function handleAddToWishlist(movie) {
    if (!movie?.id) {
      console.error("Missing movie id for wishlist.");
      return;
    }
    try {
      await api.post(
        "/api/watchlist",
        { movieId: movie.id, status: "PLANNED" },
        { withCredentials: true }
      );
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth/login");
        return;
      }
      console.error("Error adding to wishlist:", error);
    }
  }


  useEffect(() => {
    fetchTrendingMovies();
    fetchRecommendedMovies();
    fetchCategoryRows();
    fetchContinueWatching();
  }, []);

  return (
    <main className="cinetrack-page">
      <HomeNav />
      <HeroBanner movie={featuredMovie} />

      <MovieStrip
        title="Trending Movies"
        movies={trendingMovies}
        onViewDetails={handleViewDetails}
        onAddToWishlist={handleAddToWishlist}
        onSectionAction={() => navigate("/trending")}
      />
      <RecommendedSection movies={recommendedMovies} onRefresh={fetchRecommendedMovies} />
      <ContinueWatchingSection
        items={continueItems}
        onResume={(item) => handleViewDetails(item.movie)}
      />
      
      
      {Object.entries(categoryRows).map(([rowTitle, rowMovies]) => (
        <MovieStrip
          key={rowTitle}
          title={rowTitle}
          movies={rowMovies}
          onViewDetails={handleViewDetails}
          onAddToWishlist={handleAddToWishlist}
        />
      ))}

      <ChatbotSection />
      <HomeFooter />
    </main>
  );
}

export default Home;
