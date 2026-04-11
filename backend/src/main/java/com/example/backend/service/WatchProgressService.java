package com.example.backend.service;

import com.example.backend.model.Movie;
import com.example.backend.model.WatchProgress;
import com.example.backend.repository.MovieRepository;
import com.example.backend.repository.WatchProgressRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WatchProgressService {

    private final WatchProgressRepository watchProgressRepository;
    private final MovieRepository movieRepository;

    public WatchProgressService(
            WatchProgressRepository watchProgressRepository,
            MovieRepository movieRepository
    ) {
        this.watchProgressRepository = watchProgressRepository;
        this.movieRepository = movieRepository;
    }

    public List<ProgressItem> getRecentProgress(String userId) {
        List<WatchProgress> entries = watchProgressRepository.findTop10ByUserIdOrderByUpdatedAtDesc(userId);
        List<ProgressItem> result = new ArrayList<>();
        for (WatchProgress entry : entries) {
            Optional<Movie> movie = movieRepository.findById(entry.getMovieId());
            movie.ifPresent(value ->
                    result.add(new ProgressItem(
                            entry.getMovieId(),
                            value,
                            entry.getProgressPercent(),
                            entry.getUpdatedAt()
                    ))
            );
        }
        return result;
    }

    public Optional<WatchProgress> getProgress(String userId, String movieId) {
        return watchProgressRepository.findByUserIdAndMovieId(userId, movieId);
    }

    public ProgressItem upsert(String userId, String movieId, Integer progressPercent) {
        if (movieId == null || movieId.isBlank()) {
            throw new IllegalArgumentException("Movie id is required.");
        }
        if (progressPercent == null || progressPercent < 0 || progressPercent > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100.");
        }

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found."));

        WatchProgress entry = watchProgressRepository
                .findByUserIdAndMovieId(userId, movieId)
                .orElseGet(() -> new WatchProgress(userId, movieId, progressPercent, Instant.now()));

        entry.setProgressPercent(progressPercent);
        entry.setUpdatedAt(Instant.now());
        WatchProgress saved = watchProgressRepository.save(entry);

        return new ProgressItem(saved.getMovieId(), movie, saved.getProgressPercent(), saved.getUpdatedAt());
    }

    public record ProgressItem(String movieId, Movie movie, Integer progressPercent, Instant updatedAt) {}
}
