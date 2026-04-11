package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "movies")
public class Movie {

    @Id
    private String id;

    private String imdb_id;
    private String title;
    private String poster_url;
    private String overview;
    @Field("release_year")
    private Integer releaseYear;
    private Double rating;
    private Integer votes;
    private String country;
    private String genre;
    private String language;
    private Double runtime;

    public Movie() {}

    public Movie(String imdb_id, String title, String poster_url, String overview,
                 Integer releaseYear, Double rating, Integer votes,
                 String country, String genre, String language, Double runtime) {
        this.imdb_id = imdb_id;
        this.title = title;
        this.poster_url = poster_url;
        this.overview = overview;
        this.releaseYear = releaseYear;
        this.rating = rating;
        this.votes = votes;
        this.country = country;
        this.genre = genre;
        this.language = language;
        this.runtime = runtime;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public String getImdb_id() {
        return imdb_id;
    }

    public void setImdb_id(String imdb_id) {
        this.imdb_id = imdb_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPoster_url() {
        return poster_url;
    }

    public void setPoster_url(String poster_url) {
        this.poster_url = poster_url;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getVotes() {
        return votes;
    }

    public void setVotes(Integer votes) {
        this.votes = votes;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Double getRuntime() {
        return runtime;
    }

    public void setRuntime(Double runtime) {
        this.runtime = runtime;
    }
}
