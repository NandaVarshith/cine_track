package com.example.backend.repository;

import com.example.backend.model.WatchList;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WatchListRepository extends MongoRepository<WatchList, String> {
    List<WatchList> findByUserId(String userId);
    Optional<WatchList> findByUserIdAndMovieId(String userId, String movieId);
    void deleteByUserIdAndMovieId(String userId, String movieId);
}
