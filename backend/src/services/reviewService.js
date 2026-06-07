import { Movie } from "../models/movie.js";
import { Review } from "../models/review.js";
import { User } from "../models/user.js";

export function getReviewsForMovie(movieId) {
  return Review.find({ movieId }).sort({ createdAt: -1 });
}

export function getReviewsForUser(userId) {
  return Review.find({ userId }).sort({ createdAt: -1 });
}

export async function upsertReview(userId, movieId, rating, comment) {
  if (!movieId?.trim()) {
    throw new Error("Movie id is required.");
  }
  if (rating == null || rating < 1 || rating > 10) {
    throw new Error("Rating must be between 1 and 10.");
  }
  if (!comment?.trim()) {
    throw new Error("Comment cannot be empty.");
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new Error("Movie not found.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const displayName = user.name?.trim() || user.email || "Anonymous";
  const now = new Date();
  const review = await Review.findOne({ userId, movieId }) || new Review({
    userId,
    movieId,
    createdAt: now,
  });

  review.userName = displayName;
  review.movieTitle = movie.title;
  review.rating = rating;
  review.comment = comment;
  review.updatedAt = now;
  return review.save();
}

export async function updateReview(userId, reviewId, rating, comment) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found.");
  }
  if (review.userId !== userId) {
    throw new Error("Not allowed.");
  }
  if (rating != null) {
    if (rating < 1 || rating > 10) {
      throw new Error("Rating must be between 1 and 10.");
    }
    review.rating = rating;
  }
  if (comment?.trim()) {
    review.comment = comment;
  }
  review.updatedAt = new Date();
  return review.save();
}

export async function deleteReview(userId, reviewId) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found.");
  }
  if (review.userId !== userId) {
    throw new Error("Not allowed.");
  }
  await review.deleteOne();
}
