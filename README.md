# Movie Watchlist (Simple Full-Stack Project)

A complete beginner-friendly project with:

- `frontend`: React + Vite
- `backend`: Node.js + Express REST API
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
- `backend/` Express API

## Prerequisites

- Node.js 20+
- MongoDB (local or hosted)

## 1) Run Backend

```powershell
cd backend
npm install
npm run dev
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
- `APP_CORS_ALLOWED_ORIGINS=http://localhost:5173`
- `GROQ_API_KEY=` for AI chatbot recommendations

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
- `POST /auth/login` - login and receive JWT
- `GET /watchlist` - authenticated watchlist
- `POST /chatbot` - AI movie recommendations

## Frontend Environment

Create `.env` from `frontend/.env.example` if needed:

```
VITE_API_URL=http://localhost:8080
```
