const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
const MOVIES_API = `${API_BASE}/movies`;

async function parseError(response, fallbackMessage) {
  try {
    const data = await response.json();
    if (data?.message) {
      return data.message;
    }
  } catch {
    // Ignore JSON parse errors and use fallback message.
  }
  return fallbackMessage;
}

export async function fetchMovies() {
  const response = await fetch(MOVIES_API);
  if (!response.ok) {
    throw new Error(await parseError(response, "Could not fetch movies."));
  }
  return response.json();
}

export async function createMovie(moviePayload) {
  const response = await fetch(MOVIES_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moviePayload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Could not add movie."));
  }

  return response.json();
}

export async function deleteMovie(id) {
  const response = await fetch(`${MOVIES_API}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Could not delete movie."));
  }
}

export async function updateMovie(id, moviePayload) {
  const response = await fetch(`${MOVIES_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moviePayload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Could not update movie."));
  }

  return response.json();
}
