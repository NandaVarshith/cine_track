package com.example.backend.controller;

import com.example.backend.model.Movie;
import com.example.backend.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping({"/movies", "/api/movies"})
@CrossOrigin(origins = "http://localhost:5173",allowCredentials = "true")
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> getAllMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre
    ){
        return movieService.searchMovies(title, genre);
    }

    @GetMapping("/{id}")
    public Movie getMovie(@PathVariable String id){
        return movieService.getMovieById(id);
    }

    @GetMapping("/{id}/similar")
    public List<Movie> getSimilarMovies(@PathVariable String id) {
        return movieService.getSimilarMovies(id);
    }

    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String query) {
        return movieService.searchMovies(query);
    }

    @GetMapping("/genre/{genre}")
    public List<Movie> getMoviesByGenre(@PathVariable String genre) {
        return movieService.getMoviesByGenre(genre);
    }

    @GetMapping("/top-rated")
    public List<Movie> getTopRatedMovies() {
        return movieService.getTopRatedMovies();
    }

    @GetMapping("/trending")
    public List<Movie> getTrendingMovies() {
        return movieService.getTrendingMovies();
    }

    @GetMapping("/popular")
    public List<Movie> getPopularMovies() {
        return movieService.getPopularMovies();
    }

    @GetMapping("/recommended")
    public List<Movie> getRecommendedMovies() {
        return movieService.getRecommendedMovies();
    }

    @GetMapping("/categories")
    public Map<String, List<Movie>> getCategoryRows() {
        return movieService.getCategoryRows();
    }

    @PostMapping
    public Movie createMovie(@RequestBody Movie movie) {
        return movieService.createMovie(movie);
    }

    @PutMapping("/{id}")
    public Movie updateMovie(@PathVariable String id, @RequestBody Movie movie) {
        return movieService.updateMovie(id, movie);
    }

    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable String id) {
        movieService.deleteMovie(id);
    }
}
