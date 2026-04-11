package com.example.backend.service;

import com.example.backend.model.Movie;
import com.example.backend.model.Review;
import com.example.backend.model.User;
import com.example.backend.repository.MovieRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            MovieRepository movieRepository,
            UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    public List<Review> getReviewsForMovie(String movieId) {
        return reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId);
    }

    public List<Review> getReviewsForUser(String userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Review> getReviewByUserAndMovie(String userId, String movieId) {
        return reviewRepository.findByUserIdAndMovieId(userId, movieId);
    }

    public Review upsertReview(String userId, String movieId, Integer rating, String comment) {
        if (movieId == null || movieId.isBlank()) {
            throw new IllegalArgumentException("Movie id is required.");
        }
        if (rating == null || rating < 1 || rating > 10) {
            throw new IllegalArgumentException("Rating must be between 1 and 10.");
        }
        if (comment == null || comment.isBlank()) {
            throw new IllegalArgumentException("Comment cannot be empty.");
        }

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        String displayName = user.getName();
        if (displayName == null || displayName.isBlank()) {
            displayName = user.getEmail() == null ? "Anonymous" : user.getEmail();
        }
        final String displayNameFinal = displayName;

        Review review = reviewRepository
                .findByUserIdAndMovieId(userId, movieId)
                .orElseGet(() -> new Review(
                        userId,
                        displayNameFinal,
                        movieId,
                        movie.getTitle(),
                        rating,
                        comment,
                        Instant.now(),
                        Instant.now()
                ));

        review.setUserName(displayNameFinal);
        review.setMovieTitle(movie.getTitle());
        review.setRating(rating);
        review.setComment(comment);
        review.setUpdatedAt(Instant.now());

        return reviewRepository.save(review);
    }

    public Review updateReview(String userId, String reviewId, Integer rating, String comment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found."));

        if (!review.getUserId().equals(userId)) {
            throw new SecurityException("Not allowed.");
        }

        if (rating != null) {
            if (rating < 1 || rating > 10) {
                throw new IllegalArgumentException("Rating must be between 1 and 10.");
            }
            review.setRating(rating);
        }

        if (comment != null && !comment.isBlank()) {
            review.setComment(comment);
        }

        review.setUpdatedAt(Instant.now());
        return reviewRepository.save(review);
    }

    public void deleteReview(String userId, String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found."));
        if (!review.getUserId().equals(userId)) {
            throw new SecurityException("Not allowed.");
        }
        reviewRepository.delete(review);
    }
}
