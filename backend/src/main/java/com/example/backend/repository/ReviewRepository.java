package com.example.backend.repository;

import com.example.backend.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByMovieIdOrderByCreatedAtDesc(String movieId);
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Review> findByUserIdAndMovieId(String userId, String movieId);
}
