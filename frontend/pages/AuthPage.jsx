import "../src/index.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MODES = ["login", "signup"];

function AuthPage() {
  const navigate = useNavigate();
  const { mode } = useParams();
  const initialMode = useMemo(() => (MODES.includes(mode) ? mode : "login"), [mode]);
  const [activeMode, setActiveMode] = useState(initialMode);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ loading: false, error: "" });

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  function handleModeChange(nextMode) {
    setActiveMode(nextMode);
    navigate(`/auth/${nextMode}`);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: true, error: "" });

    if (activeMode === "signup" && formValues.password !== formValues.confirmPassword) {
      setStatus({ loading: false, error: "Passwords do not match." });
      return;
    }

    try {
      if (activeMode === "signup") {
        await axios.post(
          "http://localhost:8080/api/auth/register",
          {
            name: formValues.name,
            email: formValues.email,
            password: formValues.password,
          },
          { withCredentials: true }
        );
      }

      await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: formValues.email,
          password: formValues.password,
        },
        { withCredentials: true }
      );

      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to authenticate. Please try again.";
      setStatus({ loading: false, error: message });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-panel">
          <div className="auth-panel-content">
            <p className="auth-kicker">CineTrack</p>
            <h1>Return to the stories you love.</h1>
            <p className="auth-lead">
              Build your watchlist, track every moment, and keep the conversation going
              with your cinematic circle.
            </p>
            <div className="auth-highlights">
              <div>
                <h3>12K+</h3>
                <p>Curated movies & shows</p>
              </div>
              <div>
                <h3>4.9★</h3>
                <p>Community ratings</p>
              </div>
              <div>
                <h3>24/7</h3>
                <p>Smart recommendations</p>
              </div>
            </div>
            <div className="auth-badges">
              <span>Personalized recs</span>
              <span>Smart watchlists</span>
              <span>Live chat assistant</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>{activeMode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p>
              {activeMode === "login"
                ? "Log in to continue your watch journey."
                : "Join CineTrack and start building your universe."}
            </p>
          </div>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              className={activeMode === "login" ? "is-active" : ""}
              onClick={() => handleModeChange("login")}
              role="tab"
              aria-selected={activeMode === "login"}
            >
              Log in
            </button>
            <button
              type="button"
              className={activeMode === "signup" ? "is-active" : ""}
              onClick={() => handleModeChange("signup")}
              role="tab"
              aria-selected={activeMode === "signup"}
            >
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {activeMode === "signup" && (
              <label>
                Full name
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formValues.email}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder={activeMode === "login" ? "Enter your password" : "Create a secure password"}
                value={formValues.password}
                onChange={handleInputChange}
                required
              />
            </label>

            {activeMode === "signup" && (
              <label>
                Confirm password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={formValues.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </label>
            )}

            {activeMode === "login" ? (
              <div className="auth-row">
                <label className="auth-checkbox">
                  <input type="checkbox" />
                  Remember me
                </label>
                <button type="button" className="auth-link">
                  Forgot password?
                </button>
              </div>
            ) : (
              <p className="auth-legal">
                By creating an account, you agree to our Terms and Privacy Policy.
              </p>
            )}

            {status.error && <p className="auth-error">{status.error}</p>}

            <button className="primary-btn auth-submit" type="submit" disabled={status.loading}>
              {status.loading
                ? "Please wait..."
                : activeMode === "login"
                ? "Log in"
                : "Create account"}
            </button>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="auth-socials">
              <button type="button" disabled>
                Google
              </button>
              <button type="button" disabled>
                Apple
              </button>
              <button type="button" disabled>
                Discord
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
