import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/movies";
const allowedOrigins = (process.env.APP_CORS_ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ message: "CineTrack API is running." });
});

app.use(["/auth", "/api/auth"], authRoutes);
app.use(["/chatbot", "/api/chatbot"], chatbotRoutes);
app.use(["/movies", "/api/movies"], movieRoutes);
app.use(["/progress", "/api/progress"], progressRoutes);
app.use(["/reviews", "/api/reviews"], reviewRoutes);
app.use(["/users", "/api/users"], userRoutes);
app.use(["/watchlist", "/api/watchlist"], watchlistRoutes);

app.use(errorHandler);

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`CineTrack API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
