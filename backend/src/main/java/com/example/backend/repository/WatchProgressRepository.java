package com.example.backend.repository;

import com.example.backend.model.WatchProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WatchProgressRepository extends MongoRepository<WatchProgress, String> {
    List<WatchProgress> findTop10ByUserIdOrderByUpdatedAtDesc(String userId);
    Optional<WatchProgress> findByUserIdAndMovieId(String userId, String movieId);
}
