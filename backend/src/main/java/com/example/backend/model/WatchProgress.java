package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "progress")
public class WatchProgress {

    @Id
    private String id;

    private String userId;
    private String movieId;
    private Integer progressPercent;
    private Instant updatedAt;

    public WatchProgress() {}

    public WatchProgress(String userId, String movieId, Integer progressPercent, Instant updatedAt) {
        this.userId = userId;
        this.movieId = movieId;
        this.progressPercent = progressPercent;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public Integer getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(Integer progressPercent) {
        this.progressPercent = progressPercent;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
