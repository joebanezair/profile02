# MERN Booking App

A basic full-stack booking manager added to the `profile02` repository without changing the existing portfolio.

## Features

- React + Vite frontend
- Node.js + Express API
- MongoDB + Mongoose
- Email/password registration and login
- bcrypt password hashing
- JWT authentication
- Protected booking routes
- Create, read, update and delete bookings
- Per-user booking ownership
- Booking statuses: pending, confirmed, cancelled

## Run in GitHub Codespaces

### 1. Start MongoDB

You can use MongoDB Atlas or a MongoDB instance available to your Codespace.

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret_here
CLIENT_URL=http://localhost:5173
```

For GitHub Codespaces, after Vite forwards port 5173, set `CLIENT_URL` to the forwarded frontend URL if the browser blocks requests because of CORS.

### 2. Start the API

```bash
cd booking-app/server
npm install
npm run dev
```

### 3. Start the React frontend

In a second terminal:

```bash
cd booking-app/client
npm install
npm run dev
```

Open the forwarded port for 5173.

## API

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Bookings

All booking endpoints require:

```
Authorization: Bearer <token>
```

- `GET /api/bookings`
- `POST /api/bookings`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`

## Notes

The JWT is stored in `localStorage` for this learning project. For a production application, consider secure HttpOnly cookies, CSRF protection, stronger validation, rate limiting, refresh-token/session strategy, logging and automated tests.
