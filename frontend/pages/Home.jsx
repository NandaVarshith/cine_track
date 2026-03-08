import "../src/index.css";
import { useNavigate } from "react-router-dom";
import ChatbotSection from "../components/home/ChatbotSection.jsx";
import ContinueWatchingSection from "../components/home/ContinueWatchingSection.jsx";
import HeroBanner from "../components/home/HeroBanner.jsx";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNav from "../components/home/HomeNav.jsx";
import MovieStrip from "../components/home/MovieStrip.jsx";
import RecommendedSection from "../components/home/RecommendedSection.jsx";
import {
  categoryRows,
  continueWatching,
  featuredMovie,
  recommendedMovies,
  trendingMovies,
} from "../components/home/homeData.js";

function Home() {
  const navigate = useNavigate();

  function handleViewDetails(movie) {
    navigate(`/movie/${movie.id || "eclipse-protocol"}`);
  }

  return (
    <main className="cinetrack-page">
      <HomeNav />
      <HeroBanner movie={featuredMovie} />

      <MovieStrip title="Trending Movies" movies={trendingMovies} onViewDetails={handleViewDetails} />
      <RecommendedSection movies={recommendedMovies} />
      <ContinueWatchingSection movies={continueWatching} />

      {categoryRows.map((rowTitle) => (
        <MovieStrip
          key={rowTitle}
          title={rowTitle}
          movies={trendingMovies}
          onViewDetails={handleViewDetails}
        />
      ))}

      <ChatbotSection />
      <HomeFooter />
    </main>
  );
}

export default Home;
