# Serenity

Serenity is a full-stack wellness web app with journaling, relaxing media, mini-games, meditation tools, and yoga/tips modules.

## Tech Stack

- Frontend: React, Vite, Framer Motion, Axios, React Router
- Backend: Node.js, Express, MongoDB (Mongoose), JWT Auth
- Deployment: Vercel (frontend + backend API)

## Core Features

- JWT-based authentication (signup/login)
- Personal journal with:
  - entry creation
  - delete
  - pagination
- Multiplayer Tic-Tac-Toe with room codes
  - conflict-safe move handling
  - periodic room sync from frontend
- Memory match game
- Music section with saved playlists (up to 3 per platform)
- Relaxation tips, meditation timer, yoga tutorials
- Enhanced frontend UX with animated landing/dashboard

## Project Structure

```text
serenity/
  backend/
    index.js
    models/
    routes/
    middleware/
  frontend/
    src/
      pages/
      App.jsx
      index.css
```

## Environment Variables

### Backend (`backend/.env`)

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000
JOURNAL_ENTRY_LIMIT=200
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

Use your deployed backend URL for production.

## Local Development

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Run backend

```bash
cd backend
npm run dev
```

### 3. Run frontend

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Build

```bash
cd frontend
npm run build
```

## API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Journal

- `POST /api/journal` (auth)
- `GET /api/journal?page=1&limit=10` (auth)
- `DELETE /api/journal/:id` (auth)

### Games

- `POST /api/games/rooms` (auth)
- `GET /api/games/rooms/:roomCode` (auth)
- `POST /api/games/rooms/:roomCode/move` (auth)
- `POST /api/games/rooms/:roomCode/reset` (auth)

## Security & Backend Notes

- Request validation middleware for auth/journal/game inputs
- Centralized error handling middleware
- Security headers middleware
- API + auth rate limiting
- Bearer token validation in auth middleware

## Deployment Notes (Vercel)

- Ensure backend env vars are set in Vercel (`MONGO_URI`, `JWT_SECRET`, optional `JOURNAL_ENTRY_LIMIT`)
- Ensure frontend `VITE_API_URL` points to deployed backend
- Push to `main` to trigger deployment if auto-deploy is enabled

## Current Status

- Frontend production build passes
- No automated test suite configured yet

## Future Improvements

- Add API integration tests (Jest + Supertest)
- Add CI workflow (GitHub Actions)
- Upgrade games from polling to real-time (Socket.IO)
