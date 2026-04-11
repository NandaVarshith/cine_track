package com.example.backend.service;

import com.example.backend.model.Movie;
import com.example.backend.repository.MovieRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private static final int DEFAULT_MAX_RESULTS = 6;
    private static final int MAX_RESULTS_CAP = 10;

    private final MovieRepository movieRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;
    private final String baseUrl;

    public ChatbotService(
            MovieRepository movieRepository,
            @Value("${groq.api.key:}") String apiKey,
            @Value("${groq.model:llama-3.3-70b-versatile}") String model,
            @Value("${groq.base-url:https://api.groq.com/openai/v1}") String baseUrl
    ) {
        this.movieRepository = movieRepository;
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.model = model;
        this.baseUrl = baseUrl;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public ChatbotResponse getRecommendations(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return new ChatbotResponse("Tell me a genre, mood, or a movie you like.", List.of());
        }

        if (apiKey.isBlank()) {
            return new ChatbotResponse(
                    "AI recommendations are not configured yet. Please set GROQ_API_KEY on the server.",
                    List.of()
            );
        }

        FilterRequest filters = callGroqForFilters(userMessage)
                .orElseGet(() -> FilterRequest.fromQuery(userMessage));

        FilterOutcome outcome = findWithFallback(filters);
        return new ChatbotResponse(outcome.replyText, outcome.movies);
    }

    private Optional<FilterRequest> callGroqForFilters(String userMessage) {
        try {
            String instructions = """
                    You are a movie recommendation assistant. Extract search filters from the user message.
                    Respond ONLY with a valid JSON object (no markdown) with this schema:
                    {
                      "replyText": string,
                      "query": string|null,
                      "genres": string[],
                      "minRating": number|null,
                      "yearFrom": integer|null,
                      "yearTo": integer|null,
                      "maxResults": integer
                    }
                    Keep replyText short and friendly (1 sentence). Use genres like Action, Thriller, Sci-Fi, Drama.
                    If no filter exists, set fields to null or empty arrays. maxResults between 4 and 10.
                    """;

            String payload = objectMapper.writeValueAsString(buildChatPayload(instructions, userMessage));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .timeout(Duration.ofSeconds(20)) // avoid hanging the servlet thread on slow LLM responses
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Optional.empty();
            }

            String outputText = extractChatContent(response.body());
            if (outputText == null || outputText.isBlank()) {
                return Optional.empty();
            }

            String jsonText = stripCodeFences(outputText);
            FilterRequest parsed = objectMapper.readValue(jsonText, FilterRequest.class);
            return Optional.of(parsed);
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    private ObjectNode buildChatPayload(String instructions, String userMessage) {
        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("model", model);
        payload.put("temperature", 0.3);
        ArrayNode messages = objectMapper.createArrayNode();

        ObjectNode system = objectMapper.createObjectNode();
        system.put("role", "system");
        system.put("content", instructions);
        messages.add(system);

        ObjectNode user = objectMapper.createObjectNode();
        user.put("role", "user");
        user.put("content", userMessage);
        messages.add(user);

        payload.set("messages", messages);
        return payload;
    }

    private String extractChatContent(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode choices = root.path("choices");
        if (choices.isArray() && choices.size() > 0) {
            return choices.get(0).path("message").path("content").asText(null);
        }
        return null;
    }

    private List<Movie> filterMovies(FilterRequest filters) {
        List<Movie> allMovies = movieRepository.findAll();
        String query = normalize(filters.query);
        List<String> genres = filters.genres == null ? List.of() : filters.genres.stream()
                .filter(Objects::nonNull)
                .map(this::normalize)
                .filter(value -> !value.isBlank())
                .toList();

        return allMovies.stream()
                .filter(movie -> matchesQuery(movie, query))
                .filter(movie -> matchesGenres(movie, genres))
                .filter(movie -> matchesYear(movie, filters.yearFrom, filters.yearTo))
                .filter(movie -> matchesRating(movie, filters.minRating))
                .sorted(Comparator
                        .comparing(Movie::getRating, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(Movie::getVotes, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(Movie::getTitle, Comparator.nullsLast(String::compareToIgnoreCase)))
                .limit(resolveMaxResults(filters.maxResults))
                .collect(Collectors.toList());
    }

    private boolean matchesQuery(Movie movie, String query) {
        if (query == null || query.isBlank()) {
            return true;
        }
        String haystack = String.join(" ",
                normalize(movie.getTitle()),
                normalize(movie.getGenre()),
                normalize(movie.getOverview()),
                normalize(movie.getCountry()),
                normalize(movie.getLanguage())
        );
        if (haystack.contains(query)) {
            return true;
        }
        List<String> tokens = splitTokens(query);
        for (String token : tokens) {
            if (token.length() < 3) {
                continue;
            }
            if (haystack.contains(token)) {
                return true;
            }
        }
        return false;
    }

    private boolean matchesGenres(Movie movie, List<String> genres) {
        if (genres.isEmpty()) {
            return true;
        }
        String movieGenres = normalize(movie.getGenre());
        for (String genre : genres) {
            if (movieGenres.contains(genre)) {
                return true;
            }
        }
        return false;
    }

    private boolean matchesYear(Movie movie, Integer yearFrom, Integer yearTo) {
        if (yearFrom == null && yearTo == null) {
            return true;
        }
        Integer releaseYear = movie.getReleaseYear();
        if (releaseYear == null) {
            return false;
        }
        if (yearFrom != null && releaseYear < yearFrom) {
            return false;
        }
        if (yearTo != null && releaseYear > yearTo) {
            return false;
        }
        return true;
    }

    private boolean matchesRating(Movie movie, Double minRating) {
        if (minRating == null) {
            return true;
        }
        if (movie.getRating() == null) {
            return false;
        }
        return movie.getRating() >= minRating;
    }

    private int resolveMaxResults(Integer requested) {
        if (requested == null || requested <= 0) {
            return DEFAULT_MAX_RESULTS;
        }
        return Math.min(requested, MAX_RESULTS_CAP);
    }

    private String buildReply(FilterRequest filters, List<Movie> matches) {
        if (matches.isEmpty()) {
            return "I couldn't find matches for that. Try a broader genre or a different title.";
        }
        if (filters.replyText != null && !filters.replyText.isBlank()) {
            return filters.replyText;
        }
        return "Here are some movies you might enjoy.";
    }

    private String stripCodeFences(String text) {
        String trimmed = text.trim();
        if (trimmed.startsWith("```")) {
            int firstLineEnd = trimmed.indexOf('\n');
            int lastFence = trimmed.lastIndexOf("```");
            if (firstLineEnd != -1 && lastFence > firstLineEnd) {
                return trimmed.substring(firstLineEnd + 1, lastFence).trim();
            }
        }
        return trimmed;
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.toLowerCase(Locale.ROOT);
    }

    private List<String> splitTokens(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return List.of(value.toLowerCase(Locale.ROOT).split("[^a-z0-9]+")).stream()
                .filter(token -> !token.isBlank())
                .toList();
    }

    private FilterOutcome findWithFallback(FilterRequest filters) {
        List<Movie> matches = filterMovies(filters);
        if (!matches.isEmpty()) {
            return new FilterOutcome(buildReply(filters, matches), matches);
        }

        FilterRequest relaxed = filters.copy();
        if (relaxed.minRating != null) {
            relaxed.minRating = null;
            matches = filterMovies(relaxed);
            if (!matches.isEmpty()) {
                return new FilterOutcome("I widened the search a bit. Here are some matches.", matches);
            }
        }

        if (relaxed.yearFrom != null || relaxed.yearTo != null) {
            relaxed.yearFrom = null;
            relaxed.yearTo = null;
            matches = filterMovies(relaxed);
            if (!matches.isEmpty()) {
                return new FilterOutcome("I broadened the year range. Try these picks.", matches);
            }
        }

        if (relaxed.genres != null && !relaxed.genres.isEmpty()) {
            relaxed.genres = new ArrayList<>();
            matches = filterMovies(relaxed);
            if (!matches.isEmpty()) {
                return new FilterOutcome("No direct genre match, so here are popular options.", matches);
            }
        }

        if (relaxed.query != null && !relaxed.query.isBlank()) {
            relaxed.query = null;
            matches = filterMovies(relaxed);
            if (!matches.isEmpty()) {
                return new FilterOutcome("No exact title match, but these are great picks.", matches);
            }
        }

        List<Movie> fallback = movieRepository.findTop10ByOrderByRatingDesc();
        return new FilterOutcome("I couldn't find a close match, so here are top-rated picks.", fallback);
    }

    public record ChatbotResponse(String replyText, List<Movie> movies) {}
    public record FilterOutcome(String replyText, List<Movie> movies) {}

    public static class FilterRequest {
        public String replyText;
        public String query;
        public List<String> genres = new ArrayList<>();
        public Double minRating;
        public Integer yearFrom;
        public Integer yearTo;
        public Integer maxResults;

        public FilterRequest copy() {
            FilterRequest copy = new FilterRequest();
            copy.replyText = this.replyText;
            copy.query = this.query;
            copy.genres = this.genres == null ? new ArrayList<>() : new ArrayList<>(this.genres);
            copy.minRating = this.minRating;
            copy.yearFrom = this.yearFrom;
            copy.yearTo = this.yearTo;
            copy.maxResults = this.maxResults;
            return copy;
        }

        public static FilterRequest fromQuery(String query) {
            FilterRequest request = new FilterRequest();
            request.query = query;
            request.maxResults = DEFAULT_MAX_RESULTS;
            request.replyText = "Here are some picks based on that.";
            return request;
        }
    }
}
