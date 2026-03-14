import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNav from "../components/home/HomeNav.jsx";
import { quickPrompts } from "../components/chatbot/chatbotData.js";
import "../src/index.css";
import { api } from "../src/api/client.js";

function ChatbotPage() {
  const navigate = useNavigate();
  const messageListRef = useRef(null);
  const nextMessageIdRef = useRef(2);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hi, I am your movie assistant. Ask for a genre or mood and I will suggest movies.",
      movies: [],
    },
  ]);

  const canSend = useMemo(() => inputValue.trim().length > 0 && !isThinking, [inputValue, isThinking]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  function addUserAndAssistantMessages(userText) {
    const trimmed = userText.trim();
    if (!trimmed || isThinking) {
      return;
    }

    const userMessage = {
      id: nextMessageIdRef.current++,
      role: "user",
      text: trimmed,
      movies: [],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    api
      .post("/api/chatbot", { message: trimmed })
      .then((response) => {
        const data = response.data || {};
        const assistantMessage = {
          id: nextMessageIdRef.current++,
          role: "assistant",
          text: data.replyText || "Here are some recommendations.",
          movies: Array.isArray(data.movies) ? data.movies : [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      })
      .catch(() => {
        const assistantMessage = {
          id: nextMessageIdRef.current++,
          role: "assistant",
          text: "Sorry, I couldn't fetch recommendations right now.",
          movies: [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      })
      .finally(() => {
        setIsThinking(false);
      });
  }

  function handleSend(event) {
    event.preventDefault();
    addUserAndAssistantMessages(inputValue);
  }

  function handleQuickPrompt(prompt) {
    addUserAndAssistantMessages(prompt);
  }

  function handleViewDetails(movieId) {
    navigate(`/movie/${movieId || "eclipse-protocol"}`);
  }

  return (
    <main className="cinetrack-page">
      <HomeNav />

      <section className="section-block chatbot-page-header">
        <h1>Movie Recommendation Assistant</h1>
        <p>Ask the AI to suggest movies based on your mood or interests.</p>
      </section>

      <section className="section-block chatbot-shell">
        <div className="chat-window" ref={messageListRef}>
          {messages.map((message) => (
            <article
              key={message.id}
              className={`chat-message ${message.role === "user" ? "chat-user" : "chat-assistant"}`}
            >
              <div className="chat-bubble">
                <p>{message.text}</p>
              </div>

              {message.role === "assistant" && message.movies.length > 0 && (
                <div className="chat-movie-grid">
                  {message.movies.map((movie) => (
                    <article className="chat-mini-card" key={`${message.id}-${movie.title}`}>
                      <img src={movie.poster_url} alt={movie.title} loading="lazy" />
                      <div className="chat-mini-card-content">
                        <h3>{movie.title}</h3>
                        <p>Rating {movie.rating ?? "N/A"}</p>
                        <button
                          type="button"
                          className="ghost-btn"
                          onClick={() => handleViewDetails(movie.id)}
                        >
                          View Details
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </article>
          ))}

          {isThinking && (
            <article className="chat-message chat-assistant">
              <div className="chat-bubble chat-typing">
                <span />
                <span />
                <span />
              </div>
            </article>
          )}
        </div>

        <div className="chat-quick-prompts">
          {quickPrompts.map((prompt) => (
            <button key={prompt} type="button" className="ghost-btn" onClick={() => handleQuickPrompt(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <form className="chat-input-row" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Ask for movie recommendations..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            aria-label="Chat input"
          />
          <button type="submit" className="primary-btn" disabled={!canSend}>
            Send
          </button>
        </form>
      </section>

      <HomeFooter />
    </main>
  );
}

export default ChatbotPage;
