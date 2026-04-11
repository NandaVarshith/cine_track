package com.example.backend.repository;

import com.example.backend.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {

    @Query("{ 'imdb_id': ?0 }")
    Optional<Movie> findByImdb_id(String imdb_id);

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByGenreContainingIgnoreCase(String genre);

    List<Movie> findByTitleContainingIgnoreCaseOrGenreContainingIgnoreCase(String title, String genre);

    List<Movie> findTop10ByOrderByRatingDesc();

    List<Movie> findTop10ByOrderByVotesDesc();

    List<Movie> findTop10ByOrderByVotesDescRatingDesc();

    List<Movie> findTop10ByReleaseYearGreaterThanEqualOrderByVotesDescRatingDesc(int releaseYear);

    List<Movie> findTop3ByOrderByRatingDescVotesDesc();

    List<Movie> findTop10ByGenreContainingIgnoreCaseOrderByRatingDesc(String genre);

}
