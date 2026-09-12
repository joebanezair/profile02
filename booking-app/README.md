# BookFlow — MERN Booking App

A full-stack booking manager built with the MERN stack and added to the `profile02` repository as a standalone portfolio project.

## Highlights

- React + Vite responsive dashboard
- Node.js + Express REST API
- MongoDB + Mongoose persistence
- Email/password registration and login
- bcrypt password hashing
- JWT authentication
- Protected per-user booking routes
- Create, read, update and delete bookings
- Search bookings by guest, service or notes
- Filter bookings by status
- Dashboard statistics for total, upcoming, confirmed and pending bookings
- Quick status updates
- Responsive desktop/mobile interface
- Backend input validation and ObjectId checks

## Run in GitHub Codespaces

### 1. Configure the API

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret_here
CLIENT_URL=http://localhost:5173
```

For GitHub Codespaces, after Vite forwards port 5173, set `CLIENT_URL` to the forwarded frontend URL if required by CORS.

### 2. Start the API

```bash
cd booking-app/server
npm install
npm run dev
```

### 3. Start the React frontend

Open a second terminal:

```bash
cd booking-app/client
npm install
npm run dev
```

Open the forwarded port for 5173.

## REST API

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Bookings

All booking endpoints require:

```
Authorization: Bearer <token>
```

- `GET /api/bookings`
- `GET /api/bookings?status=confirmed`
- `GET /api/bookings?search=consultation`
- `POST /api/bookings`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`

## Security note

This portfolio project stores the JWT in `localStorage` to keep the learning architecture easy to understand. A production deployment should consider secure HttpOnly cookies, CSRF protection, request rate limiting, refresh/session rotation, schema validation, logging and automated tests.
