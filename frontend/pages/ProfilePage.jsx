import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/home/MovieCard.jsx";
import { HomeFooter, HomeNav } from "../components/home/index.js";
import {
  profileStats,
  profileUser,
  recentlyWatched,
  userReviews,
  wishlistPreview,
} from "../components/profile/profileData.js";
import "../src/index.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [activeSettingsPanel, setActiveSettingsPanel] = useState("");

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsSettingsMenuOpen(false);
        setActiveSettingsPanel("");
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function handleViewDetails(movie) {
    navigate(`/movie/${movie.id || "eclipse-protocol"}`);
  }

  function openSettingsPanel(panelName) {
    setIsSettingsMenuOpen(false);
    setActiveSettingsPanel(panelName);
  }

  function closeSettingsPanel() {
    setActiveSettingsPanel("");
  }

  const isModalOpen = Boolean(activeSettingsPanel);

  return (
    <main className={`cinetrack-page ${isModalOpen ? "profile-modal-active" : ""}`}>
      <HomeNav />

      <section className="section-block profile-header-card">
        <img src={profileUser.avatar} alt={`${profileUser.name} avatar`} />
        <div className="profile-header-content">
          <div className="profile-header-top">
            <h1>{profileUser.name}</h1>
            <div className="profile-settings-wrap">
              <button
                type="button"
                className="profile-settings-icon"
                aria-label="Open settings"
                onClick={() => setIsSettingsMenuOpen((prev) => !prev)}
              >
                {"\u2699"}
              </button>
              {isSettingsMenuOpen && (
                <div className="profile-settings-menu">
                  <button type="button" onClick={() => openSettingsPanel("edit")}>
                    Edit Profile
                  </button>
                  <button type="button" onClick={() => openSettingsPanel("password")}>
                    Change Password
                  </button>
                  <button type="button" onClick={() => openSettingsPanel("logout")}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="profile-email">{profileUser.email}</p>
          <p className="profile-bio">{profileUser.bio}</p>
        </div>
      </section>

      <section className="section-block profile-stats-grid">
        {profileStats.map((stat) => (
          <article key={stat.label} className="profile-stat-card">
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>Recently Watched</h2>
        </div>
        <div className="profile-movie-grid">
          {recentlyWatched.map((movie) => (
            <MovieCard
              key={`recent-${movie.id}`}
              movie={movie}
              primaryActionText="View Details"
              onPrimaryAction={handleViewDetails}
              secondaryActionText="Add to Wishlist"
            />
          ))}
        </div>
      </section>

      <section className="section-block profile-section-card">
        <div className="section-head">
          <h2>Wishlist Preview</h2>
          <button type="button" className="ghost-btn" onClick={() => navigate("/wishlist")}>
            View Full Wishlist
          </button>
        </div>
        <div className="profile-movie-grid profile-movie-grid-compact">
          {wishlistPreview.map((movie) => (
            <MovieCard
              key={`wishlist-${movie.id}`}
              movie={movie}
              primaryActionText="View Details"
              onPrimaryAction={handleViewDetails}
              secondaryActionText="Add to Wishlist"
            />
          ))}
        </div>
      </section>

      <section className="section-block profile-section-card">
        <div className="section-head">
          <h2>User Reviews</h2>
        </div>
        <div className="profile-reviews-grid">
          {userReviews.map((review) => (
            <article className="profile-review-card" key={`${review.movieTitle}-${review.rating}`}>
              <h3>{review.movieTitle}</h3>
              <p className="profile-review-rating">Rating {review.rating}</p>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      </section>

      <HomeFooter />

      {isModalOpen && (
        <div className="profile-modal-backdrop" onClick={closeSettingsPanel}>
          <article className="profile-modal-card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="profile-modal-close"
              onClick={closeSettingsPanel}
              aria-label="Close settings panel"
            >
              {"\u2715"}
            </button>

            {activeSettingsPanel === "edit" && (
              <>
                <h2>Edit Profile</h2>
                <div className="profile-modal-content">
                  <label>
                    Name
                    <input type="text" defaultValue={profileUser.name} />
                  </label>
                  <label>
                    Email
                    <input type="email" defaultValue={profileUser.email} />
                  </label>
                  <label>
                    Bio
                    <textarea defaultValue={profileUser.bio} rows="3" />
                  </label>
                  <button type="button" className="primary-btn">
                    Save Changes
                  </button>
                </div>
              </>
            )}

            {activeSettingsPanel === "password" && (
              <>
                <h2>Change Password</h2>
                <div className="profile-modal-content">
                  <label>
                    Current Password
                    <input type="password" placeholder="Enter current password" />
                  </label>
                  <label>
                    New Password
                    <input type="password" placeholder="Enter new password" />
                  </label>
                  <label>
                    Confirm Password
                    <input type="password" placeholder="Confirm new password" />
                  </label>
                  <button type="button" className="primary-btn">
                    Update Password
                  </button>
                </div>
              </>
            )}

            {activeSettingsPanel === "logout" && (
              <>
                <h2>Logout</h2>
                <div className="profile-modal-content">
                  <p>Are you sure you want to logout from CineTrack?</p>
                  <div className="profile-modal-actions">
                    <button type="button" className="secondary-btn" onClick={closeSettingsPanel}>
                      Cancel
                    </button>
                    <button type="button" className="primary-btn">
                      Confirm Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </article>
        </div>
      )}
    </main>
  );
}

export default ProfilePage;
