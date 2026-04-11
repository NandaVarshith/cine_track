package com.example.backend.service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Movie;
import com.example.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies(){
        return movieRepository.findAll();
    }

    public Movie getMovieById(String id){
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
    }

    public List<Movie> searchMovies(String title, String genre) {
        if (title != null && !title.isBlank()) {
            return movieRepository.findByTitleContainingIgnoreCase(title);
        }
        if (genre != null && !genre.isBlank()) {
            return movieRepository.findByGenreContainingIgnoreCase(genre);
        }
        return movieRepository.findAll();
    }

    public List<Movie> searchMovies(String query) {
        if (query == null || query.isBlank()) {
            return movieRepository.findAll();
        }
        return movieRepository.findByTitleContainingIgnoreCaseOrGenreContainingIgnoreCase(query, query);
    }

    public List<Movie> getMoviesByGenre(String genre) {
        if (genre == null || genre.isBlank()) {
            return movieRepository.findAll();
        }
        return movieRepository.findByGenreContainingIgnoreCase(genre);
    }

    public List<Movie> getTopRatedMovies() {
        return movieRepository.findTop10ByOrderByRatingDesc();
    }

    public List<Movie> getTrendingMovies() {
        int cutoffYear = Year.now().getValue() - 1;
        List<Movie> trending = movieRepository
                .findTop10ByReleaseYearGreaterThanEqualOrderByVotesDescRatingDesc(cutoffYear);
        if (trending.isEmpty()) {
            return getPopularMovies();
        }
        return trending;
    }

    public List<Movie> getPopularMovies() {
        return movieRepository.findTop10ByOrderByVotesDescRatingDesc();
    }

    public List<Movie> getRecommendedMovies() {
        return movieRepository.findTop3ByOrderByRatingDescVotesDesc();
    }

    public Map<String, List<Movie>> getCategoryRows() {
        Map<String, List<Movie>> rows = new LinkedHashMap<>();
        rows.put("Top Rated Movies", getTopRatedMovies());
        rows.put("Action Movies", movieRepository.findTop10ByGenreContainingIgnoreCaseOrderByRatingDesc("Action"));
        rows.put("Sci-Fi Movies", movieRepository.findTop10ByGenreContainingIgnoreCaseOrderByRatingDesc("Sci-Fi"));
        rows.put("Popular This Week", getPopularMovies());
        return rows;
    }

    public List<Movie> getSimilarMovies(String movieId) {
        Movie movie = getMovieById(movieId);
        List<String> genres = extractGenres(movie.getGenre());

        List<Movie> results = new ArrayList<>();
        for (String genre : genres) {
            if (genre.isBlank()) {
                continue;
            }
            List<Movie> candidates = movieRepository.findTop10ByGenreContainingIgnoreCaseOrderByRatingDesc(genre);
            for (Movie candidate : candidates) {
                if (!movieId.equals(candidate.getId()) && results.stream().noneMatch(m -> m.getId().equals(candidate.getId()))) {
                    results.add(candidate);
                }
            }
            if (results.size() >= 10) {
                break;
            }
        }

        if (results.isEmpty()) {
            results = getTopRatedMovies().stream()
                    .filter(candidate -> !movieId.equals(candidate.getId()))
                    .limit(10)
                    .collect(Collectors.toList());
        }

        if (results.size() > 10) {
            return results.subList(0, 10);
        }
        return results;
    }

    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie updateMovie(String id, Movie updatedMovie) {
        Movie existingMovie = getMovieById(id);

        existingMovie.setImdb_id(updatedMovie.getImdb_id());
        existingMovie.setTitle(updatedMovie.getTitle());
        existingMovie.setPoster_url(updatedMovie.getPoster_url());
        existingMovie.setOverview(updatedMovie.getOverview());
        existingMovie.setReleaseYear(updatedMovie.getReleaseYear());
        existingMovie.setRating(updatedMovie.getRating());
        existingMovie.setVotes(updatedMovie.getVotes());
        existingMovie.setCountry(updatedMovie.getCountry());
        existingMovie.setGenre(updatedMovie.getGenre());
        existingMovie.setLanguage(updatedMovie.getLanguage());
        existingMovie.setRuntime(updatedMovie.getRuntime());

        return movieRepository.save(existingMovie);
    }

    public void deleteMovie(String id) {
        Movie existingMovie = getMovieById(id);
        movieRepository.delete(existingMovie);
    }

    private List<String> extractGenres(String rawGenre) {
        if (rawGenre == null || rawGenre.isBlank()) {
            return List.of();
        }
        return List.of(rawGenre.split(",")).stream()
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toList();
    }
}
