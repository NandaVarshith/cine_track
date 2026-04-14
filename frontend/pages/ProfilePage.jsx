import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api/client.js";
import MovieCard from "../components/home/MovieCard.jsx";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNav from "../components/home/HomeNav.jsx";
import "../src/index.css";

const emptyProfile = {
  id: "",
  name: "",
  email: "",
  avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  bio: "",
};

function ProfilePage() {
  const navigate = useNavigate();
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [activeSettingsPanel, setActiveSettingsPanel] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [editValues, setEditValues] = useState({ name: "", email: "", bio: "" });
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ loading: false, error: "" });
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [profileStats, setProfileStats] = useState([
    { label: "Movies Watched", value: 0 },
    { label: "Wishlist", value: 0 },
    { label: "Dropped", value: 0 },
  ]);
  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [wishlistPreview, setWishlistPreview] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsSettingsMenuOpen(false);
        setActiveSettingsPanel("");
        setStatus({ loading: false, error: "" });
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/api/users/me", {
          withCredentials: true,
        });
        const data = response.data;
        setProfile({
          id: data.id,
          name: data.name || "",
          email: data.email || "",
          avatar: data.avatar || emptyProfile.avatar,
          bio: data.bio || "",
        });
        setEditValues({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
        });
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate("/auth/login");
        }
      }
    }

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const response = await api.get("/api/watchlist", {
          withCredentials: true,
        });
        const items = response.data || [];
        setWatchlistItems(items);

        const sorted = [...items].sort((a, b) => {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        });

        const watchedItems = sorted.filter((item) => item.status === "WATCHED");
        const plannedItems = sorted.filter((item) => item.status === "PLANNED");
        const droppedItems = sorted.filter((item) => item.status === "DROPPED");

        setProfileStats([
          { label: "Movies Watched", value: watchedItems.length },
          { label: "Wishlist", value: plannedItems.length },
          { label: "Dropped", value: droppedItems.length },
        ]);

        setRecentlyWatched(watchedItems.slice(0, 4).map((item) => item.movie));
        setWishlistPreview(plannedItems.slice(0, 3).map((item) => item.movie));
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate("/auth/login");
        }
      }
    }

    fetchWatchlist();
  }, [navigate]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await api.get("/api/reviews/me", {
          withCredentials: true,
        });
        setReviews(response.data || []);
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate("/auth/login");
        }
      }
    }

    fetchReviews();
  }, [navigate]);

  function handleViewDetails(movie) {
    navigate(`/movie/${movie.id || "eclipse-protocol"}`);
  }

  function openSettingsPanel(panelName) {
    setIsSettingsMenuOpen(false);
    setActiveSettingsPanel(panelName);
    setStatus({ loading: false, error: "" });
  }

  function closeSettingsPanel() {
    setActiveSettingsPanel("");
    setStatus({ loading: false, error: "" });
  }

  function handleEditChange(event) {
    const { name, value } = event.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveProfile() {
    setStatus({ loading: true, error: "" });
    try {
      const response = await api.patch(
        "/api/users/me",
        {
          name: editValues.name,
          avatar: profile.avatar,
          bio: editValues.bio,
        },
        { withCredentials: true }
      );

      const data = response.data;
      setProfile((prev) => ({
        ...prev,
        name: data.name || prev.name,
        bio: data.bio || prev.bio,
        avatar: data.avatar || prev.avatar,
      }));
      setEditValues((prev) => ({ ...prev, name: data.name || prev.name, bio: data.bio || prev.bio }));
      closeSettingsPanel();
    } catch (error) {
      setStatus({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Unable to update profile. Please try again.",
      });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }

  async function handleChangePassword() {
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setStatus({ loading: false, error: "New passwords do not match." });
      return;
    }

    setStatus({ loading: true, error: "" });
    try {
      await api.post(
        "/api/users/me/password",
        {
          currentPassword: passwordValues.currentPassword,
          newPassword: passwordValues.newPassword,
        },
        { withCredentials: true }
      );
      setPasswordValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      closeSettingsPanel();
    } catch (error) {
      setStatus({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Unable to update password. Please try again.",
      });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }

  async function handleLogout() {
    setStatus({ loading: true, error: "" });
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("auth_token");
      delete api.defaults.headers.common.Authorization;
      navigate("/auth/login");
    } catch (error) {
      setStatus({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Unable to logout. Please try again.",
      });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }

  const isModalOpen = Boolean(activeSettingsPanel);

  return (
    <main className={`cinetrack-page ${isModalOpen ? "profile-modal-active" : ""}`}>
      <HomeNav />

      <section className="section-block profile-header-card">
        <img src={profile.avatar} alt={`${profile.name} avatar`} />
        <div className="profile-header-content">
          <div className="profile-header-top">
            <h1>{profile.name || "Your Profile"}</h1>
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
          <p className="profile-email">{profile.email}</p>
          <p className="profile-bio">{profile.bio || "Add a short bio about yourself."}</p>
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
        {recentlyWatched.length === 0 ? (
          <p className="profile-empty">No watched movies yet.</p>
        ) : (
          <div className="profile-movie-grid">
            {recentlyWatched.map((movie) => (
              <MovieCard
                key={`recent-${movie.id}`}
                movie={movie}
                primaryActionText="View Details"
                onPrimaryAction={handleViewDetails}
                secondaryActionText="View Details"
                onSecondaryAction={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      <section className="section-block profile-section-card">
        <div className="section-head">
          <h2>Wishlist Preview</h2>
          <button type="button" className="ghost-btn" onClick={() => navigate("/wishlist")}>
            View Full Wishlist
          </button>
        </div>
        {wishlistPreview.length === 0 ? (
          <p className="profile-empty">Your wishlist is empty.</p>
        ) : (
          <div className="profile-movie-grid profile-movie-grid-compact">
            {wishlistPreview.map((movie) => (
              <MovieCard
                key={`wishlist-${movie.id}`}
                movie={movie}
                primaryActionText="View Details"
                onPrimaryAction={handleViewDetails}
                secondaryActionText="View Details"
                onSecondaryAction={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      <section className="section-block profile-section-card">
        <div className="section-head">
          <h2>User Reviews</h2>
        </div>
        {reviews.length === 0 ? (
          <p className="profile-empty">No reviews yet.</p>
        ) : (
          <div className="profile-reviews-grid">
            {reviews.map((review) => (
              <article className="profile-review-card" key={review.id || review.movieId}>
                <h3>{review.movieTitle || "Untitled Movie"}</h3>
                <p className="profile-review-rating">Rating {review.rating} / 10</p>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        )}
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
                    <input
                      type="text"
                      name="name"
                      value={editValues.name}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    Email
                    <input type="email" value={editValues.email} disabled />
                  </label>
                  <label>
                    Bio
                    <textarea
                      name="bio"
                      value={editValues.bio}
                      onChange={handleEditChange}
                      rows="3"
                    />
                  </label>
                  {status.error && <p className="profile-modal-error">{status.error}</p>}
                  <button type="button" className="primary-btn" onClick={handleSaveProfile}>
                    {status.loading ? "Saving..." : "Save Changes"}
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
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Enter current password"
                      value={passwordValues.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </label>
                  <label>
                    New Password
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      value={passwordValues.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </label>
                  <label>
                    Confirm Password
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={passwordValues.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </label>
                  {status.error && <p className="profile-modal-error">{status.error}</p>}
                  <button type="button" className="primary-btn" onClick={handleChangePassword}>
                    {status.loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </>
            )}

            {activeSettingsPanel === "logout" && (
              <>
                <h2>Logout</h2>
                <div className="profile-modal-content">
                  <p>Are you sure you want to logout from CineTrack?</p>
                  {status.error && <p className="profile-modal-error">{status.error}</p>}
                  <div className="profile-modal-actions">
                    <button type="button" className="secondary-btn" onClick={closeSettingsPanel}>
                      Cancel
                    </button>
                    <button type="button" className="primary-btn" onClick={handleLogout}>
                      {status.loading ? "Logging out..." : "Confirm Logout"}
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
