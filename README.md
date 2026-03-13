# Movie Watchlist (Simple Full-Stack Project)

A complete beginner-friendly project with:

- `frontend`: React + Vite
- `backend`: Spring Boot REST API
- Database: MongoDB

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
- MongoDB (local or hosted)

## 1) Run Backend

```powershell
cd backend
mvnw.cmd spring-boot:run
```

Backend runs on: `http://localhost:8080`

MongoDB connection string is controlled by `MONGODB_URI`.

Default:

```
mongodb://localhost:27017/movies
```

Optional env vars (recommended for non-dev):

- `MONGODB_URI=mongodb://localhost:27017/movies`
- `JWT_SECRET=change-me-to-a-long-random-secret-at-least-32-bytes`
- `JWT_EXPIRATION_SECONDS=86400`

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

## Frontend Environment

Create `.env` from `frontend/.env.example` if needed:

```
VITE_API_URL=http://localhost:8080
```
