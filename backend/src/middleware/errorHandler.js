import { AppError } from "../utils/httpErrors.js";

export function errorHandler(error, _req, res, _next) {
  if (error.message === "Not allowed by CORS") {
    res.status(403).json({ message: error.message });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  if (error.name === "CastError") {
    res.status(404).json({ message: "Resource not found." });
    return;
  }

  const message = error.message || "Invalid request.";
  if (message.toLowerCase().includes("already in use")) {
    res.status(409).json({ message });
    return;
  }
  if (message === "Not allowed.") {
    res.status(403).json({ message });
    return;
  }

  res.status(400).json({ message });
}
