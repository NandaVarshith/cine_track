package com.example.backend.controller;

import com.example.backend.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/chatbot", "/api/chatbot"})
@CrossOrigin(
        // Allow overriding from env: APP_CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app"
        origins = {"${app.cors.allowed-origins:http://localhost:5173}"},
        allowCredentials = "true"
)
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        if (request == null || request.message() == null || request.message().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Message is required."));
        }
        return ResponseEntity.ok(chatbotService.getRecommendations(request.message()));
    }

    public record ChatRequest(String message) {}
}
