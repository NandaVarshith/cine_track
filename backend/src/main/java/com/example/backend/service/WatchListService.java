package com.example.backend.service;

import com.example.backend.model.Movie;
import com.example.backend.model.MovieStatus;
import com.example.backend.model.WatchList;
import com.example.backend.repository.MovieRepository;
import com.example.backend.repository.WatchListRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WatchListService {

    private final WatchListRepository watchListRepository;
    private final MovieRepository movieRepository;

    public WatchListService(WatchListRepository watchListRepository, MovieRepository movieRepository) {
        this.watchListRepository = watchListRepository;
        this.movieRepository = movieRepository;
    }

    public List<WatchListItem> getWatchList(String userId) {
        List<WatchList> entries = watchListRepository.findByUserId(userId);
        List<WatchListItem> result = new ArrayList<>();
        for (WatchList entry : entries) {
            Optional<Movie> movie = movieRepository.findById(entry.getMovieId());
            movie.ifPresent(value ->
                    result.add(new WatchListItem(entry.getMovieId(), value, entry.getStatus(), entry.getUpdatedAt()))
            );
        }
        return result;
    }

    public WatchListItem upsert(String userId, String movieId, MovieStatus status) {
        MovieStatus safeStatus = status == null ? MovieStatus.PLANNED : status;
        WatchList entry = watchListRepository
                .findByUserIdAndMovieId(userId, movieId)
                .orElseGet(() -> new WatchList(userId, movieId, safeStatus, Instant.now()));

        entry.setStatus(safeStatus);
        entry.setUpdatedAt(Instant.now());
        WatchList saved = watchListRepository.save(entry);

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found."));

        return new WatchListItem(saved.getMovieId(), movie, saved.getStatus(), saved.getUpdatedAt());
    }

    public void remove(String userId, String movieId) {
        watchListRepository.deleteByUserIdAndMovieId(userId, movieId);
    }

    public Optional<MovieStatus> getStatus(String userId, String movieId) {
        return watchListRepository
                .findByUserIdAndMovieId(userId, movieId)
                .map(WatchList::getStatus);
    }

    public record WatchListItem(String movieId, Movie movie, MovieStatus status, Instant updatedAt) {}
}
