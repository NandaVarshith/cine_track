export const quickPrompts = [
  "Suggest a thriller movie",
  "Best sci-fi movies",
  "Movies like Inception",
];

const assistantLibrary = [
  {
    keys: ["sci-fi", "sci fi", "science fiction", "inception", "interstellar", "space"],
    intro: "Here are some great sci-fi movies you might enjoy:",
    movies: [
      {
        id: "eclipse-protocol",
        title: "Interstellar",
        rating: "8.6",
        poster:
          "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "eclipse-protocol",
        title: "Inception",
        rating: "8.8",
        poster:
          "https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "eclipse-protocol",
        title: "The Martian",
        rating: "8.0",
        poster:
          "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=500&q=80",
      },
    ],
  },
  {
    keys: ["action", "adventure", "fast", "fight"],
    intro: "You can start with these action-heavy picks:",
    movies: [
      {
        id: "eclipse-protocol",
        title: "Mad Max: Fury Road",
        rating: "8.1",
        poster:
          "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "eclipse-protocol",
        title: "John Wick",
        rating: "7.4",
        poster:
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "eclipse-protocol",
        title: "Mission: Impossible - Fallout",
        rating: "7.7",
        poster:
          "https://images.unsplash.com/photo-1608889825271-9696287ab804?auto=format&fit=crop&w=500&q=80",
      },
    ],
  },
  {
    keys: ["thriller", "suspense", "mystery", "dark"],
    intro: "If you want a thriller vibe, try these:",
    movies: [
      {
        id: "eclipse-protocol",
        title: "Se7en",
        rating: "8.6",
        poster:
          "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "eclipse-protocol",
        title: "Prisoners",
        rating: "8.1",
        poster:
          "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "eclipse-protocol",
        title: "Gone Girl",
        rating: "8.1",
        poster:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80",
      },
    ],
  },
];

export function getAssistantReply(userInput) {
  const normalized = userInput.toLowerCase();
  const matched = assistantLibrary.find((entry) =>
    entry.keys.some((keyword) => normalized.includes(keyword)),
  );

  if (matched) {
    return {
      text: matched.intro,
      movies: matched.movies,
    };
  }

  return {
    text: "Tell me a genre or mood, and I can suggest movies. Try: sci-fi, action, or thriller.",
    movies: [],
  };
}
