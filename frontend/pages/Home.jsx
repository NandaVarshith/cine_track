import "../src/index.css";
import { useNavigate } from "react-router-dom";
import {
  ChatbotSection,
  ContinueWatchingSection,
  HeroBanner,
  HomeFooter,
  HomeNav,
  MovieStrip,
  RecommendedSection,
} from "../components/home/index.js";
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
