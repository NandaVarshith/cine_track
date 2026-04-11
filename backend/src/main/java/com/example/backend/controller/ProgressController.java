package com.example.backend.controller;

import com.example.backend.service.WatchProgressService;
import com.example.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/progress", "/api/progress"})
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProgressController {

    private final WatchProgressService watchProgressService;
    private final JwtService jwtService;

    public ProgressController(WatchProgressService watchProgressService, JwtService jwtService) {
        this.watchProgressService = watchProgressService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> getRecentProgress(@CookieValue(name = "auth_token", required = false) String token) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        List<WatchProgressService.ProgressItem> items = watchProgressService.getRecentProgress(userId.get());
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<?> getProgressForMovie(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable String movieId
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        return watchProgressService.getProgress(userId.get(), movieId)
                .<ResponseEntity<?>>map(entry -> ResponseEntity.ok(Map.of(
                        "progressPercent", entry.getProgressPercent(),
                        "updatedAt", entry.getUpdatedAt()
                )))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Not found")));
    }

    @PostMapping
    public ResponseEntity<?> upsertProgress(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody ProgressRequest request
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        WatchProgressService.ProgressItem item =
                watchProgressService.upsert(userId.get(), request.movieId(), request.progressPercent());
        return ResponseEntity.ok(item);
    }

    private Optional<String> resolveUserId(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return jwtService.getUserIdFromToken(token);
    }

    public record ProgressRequest(String movieId, Integer progressPercent) {}
}
