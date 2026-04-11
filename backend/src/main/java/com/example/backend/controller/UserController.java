package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.security.JwtService;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/users", "/api/users"})
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@CookieValue(name = "auth_token", required = false) String token) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        User user = userService.getById(userId.get());
        return ResponseEntity.ok(safeUserPayload(user));
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateProfile(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody UpdateProfileRequest request
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        User user = userService.updateProfile(userId.get(), request.name(), request.avatar(), request.bio());
        return ResponseEntity.ok(safeUserPayload(user));
    }

    @PostMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody ChangePasswordRequest request
    ) {
        Optional<String> userId = resolveUserId(token);
        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        userService.changePassword(userId.get(), request.currentPassword(), request.newPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated."));
    }

    private Optional<String> resolveUserId(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return jwtService.getUserIdFromToken(token);
    }

    private Map<String, Object> safeUserPayload(User user) {
        return Map.ofEntries(
                Map.entry("id", user.getId()),
                Map.entry("name", user.getName() == null ? "" : user.getName()),
                Map.entry("email", user.getEmail() == null ? "" : user.getEmail()),
                Map.entry("avatar", user.getAvatar() == null ? "" : user.getAvatar()),
                Map.entry("bio", user.getBio() == null ? "" : user.getBio())
        );
    }

    public record UpdateProfileRequest(String name, String avatar, String bio) { }
    public record ChangePasswordRequest(String currentPassword, String newPassword) { }
}
