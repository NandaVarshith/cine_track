package com.example.backend.controller;

import com.example.backend.model.Review;
import com.example.backend.security.JwtService;
import com.example.backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/reviews", "/api/reviews"})
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtService jwtService;

    public ReviewController(ReviewService reviewService, JwtService jwtService) {
        this.reviewService = reviewService;
        this.jwtService = jwtService;
    }

    @GetMapping("/movie/{movieId}")
    public List<Review> getReviewsForMovie(@PathVariable String movieId) {
        return reviewService.getReviewsForMovie(movieId);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyReviews(@CookieValue(name = "auth_token", required = false) String token) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId.get()));
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateReview(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody ReviewRequest request
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        Review review = reviewService.upsertReview(
                userId.get(),
                request.movieId(),
                request.rating(),
                request.comment()
        );
        return ResponseEntity.ok(review);
    }

    @PatchMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable String reviewId,
            @RequestBody ReviewUpdateRequest request
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        Review review = reviewService.updateReview(userId.get(), reviewId, request.rating(), request.comment());
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable String reviewId
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        reviewService.deleteReview(userId.get(), reviewId);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    private Optional<String> resolveUserId(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return jwtService.getUserIdFromToken(token);
    }

    public record ReviewRequest(String movieId, Integer rating, String comment) { }
    public record ReviewUpdateRequest(Integer rating, String comment) { }
}
