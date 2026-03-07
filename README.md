# Movie Watchlist (Simple Full-Stack Project)

A complete beginner-friendly project with:

- `frontend`: React + Vite
- `backend`: Spring Boot REST API
- Default database: embedded H2 (no PostgreSQL setup required)

## Included Features

- Add, edit, and delete movies
- Track status (`PLANNED`, `WATCHED`, `DROPPED`)
- Search by title/genre
- Filter by status
- Sort by date, rating, or title
- Dashboard stats (total/watched/planned/dropped)

## Project Structure

- `frontend/` React app
- `backend/` Spring Boot API

## Prerequisites

- Node.js 20+
- Java 17+

## 1) Run Backend

```powershell
cd backend
mvnw.cmd spring-boot:run
```

Backend runs on: `http://localhost:8080`

Optional DB UI (H2 console): `http://localhost:8080/h2-console`

Use these values in H2 console:

- JDBC URL: `jdbc:h2:file:./data/moviewatchlist;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE`
- User Name: `sa`
- Password: (leave empty)

## 2) Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## API Endpoints

- `GET /movies` - list all movies
- `POST /movies` - create movie
- `PUT /movies/{id}` - update movie
- `DELETE /movies/{id}` - delete movie

## Optional: Use PostgreSQL Instead of H2

Set these env vars before starting backend:

- `DB_URL=jdbc:postgresql://localhost:5432/moviewatchlist`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `DB_DRIVER=org.postgresql.Driver`
