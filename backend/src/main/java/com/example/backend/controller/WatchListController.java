package com.example.backend.controller;

import com.example.backend.model.MovieStatus;
import com.example.backend.security.JwtService;
import com.example.backend.service.WatchListService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/watchlist", "/api/watchlist"})
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WatchListController {

    private final WatchListService watchListService;
    private final JwtService jwtService;

    public WatchListController(WatchListService watchListService, JwtService jwtService) {
        this.watchListService = watchListService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> getWatchList(@CookieValue(name = "auth_token", required = false) String token) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        List<WatchListService.WatchListItem> items = watchListService.getWatchList(userId.get());
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<?> addToWatchList(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody WatchListRequest request
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        WatchListService.WatchListItem item =
                watchListService.upsert(userId.get(), request.movieId(), request.status());
        return ResponseEntity.ok(item);
    }

    @PatchMapping("/{movieId}")
    public ResponseEntity<?> updateStatus(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable String movieId,
            @RequestBody WatchListRequest request
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        WatchListService.WatchListItem item =
                watchListService.upsert(userId.get(), movieId, request.status());
        return ResponseEntity.ok(item);
    }

    @GetMapping("/status/{movieId}")
    public ResponseEntity<?> getStatus(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable String movieId
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        Optional<MovieStatus> status = watchListService.getStatus(userId.get(), movieId);
        return status
                .<ResponseEntity<?>>map(value -> ResponseEntity.ok(Map.of("status", value)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Not found")));
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<?> removeFromWatchList(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable String movieId
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        watchListService.remove(userId.get(), movieId);
        return ResponseEntity.ok(Map.of("message", "Removed"));
    }

    private Optional<String> resolveUserId(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return jwtService.getUserIdFromToken(token);
    }

    public record WatchListRequest(String movieId, MovieStatus status) {}
}
