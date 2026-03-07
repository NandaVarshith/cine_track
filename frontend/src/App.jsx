import Home from "../pages/Home.jsx";
import ChatbotPage from "../pages/ChatbotPage.jsx";
import MovieDetailsPage from "../pages/MovieDetailsPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import TrendingPage from "../pages/TrendingPage.jsx";
import WishlistPage from "../pages/WishlistPage.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trending" element={<TrendingPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/movie/:id" element={<MovieDetailsPage />} />
      <Route path="/movie" element={<Navigate to="/movie/eclipse-protocol" replace />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
