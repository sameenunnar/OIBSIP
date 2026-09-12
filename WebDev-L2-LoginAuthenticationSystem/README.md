![Login Authentication System](./task2-intro.png)

# LoginAuthentication

A full-stack authentication starter kit with a **Node.js + Express + MongoDB** backend
and a **React (Vite) + Tailwind CSS** frontend. It includes registration, login,
logout, JWT access/refresh tokens, bcrypt password hashing, and a protected
dashboard route.

---

## ✨ Features

- **Secure authentication**
  - Passwords hashed with `bcryptjs` before being stored
  - Short-lived **JWT access tokens** (returned to the client, stored in memory/localStorage)
  - Long-lived **refresh tokens** stored in an `httpOnly` cookie and rotated on refresh
  - Automatic silent token refresh on the client via an Axios interceptor
- **Express API**
  - `POST /api/auth/register` — create an account
  - `POST /api/auth/login` — authenticate and receive tokens
  - `POST /api/auth/refresh` — exchange a valid refresh cookie for a new access token
  - `POST /api/auth/logout` — invalidate the refresh token and clear the cookie
  - `GET  /api/auth/profile` — return the current authenticated user (protected)
  - Input validation with `express-validator`
  - Rate limiting on the login endpoint to slow brute-force attempts
  - Security headers via `helmet`, request logging via `morgan`
- **MongoDB / Mongoose** user model with unique email, role field (`user` / `admin`)
- **React client**
  - `Login` and `Register` pages with client-side validation and error handling
  - `ProtectedRoute` component that redirects unauthenticated users to `/login`
  - `AuthContext` for global auth state (`user`, `login`, `register`, `logout`)
  - A polished **Dashboard** (protected route) with sidebar navigation, activity
    feed, analytics charts, settings, and a user directory
- **Developer experience**
  - Root-level scripts to install and run both client and server concurrently
  - Sensible `.gitignore`, `.env` templates, and an MIT `LICENSE`

---

## 🗂️ Project Structure

```
LoginAuthentication/
├── client/                     # React (Vite) frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios instance + auth/refresh interceptors
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state & API calls
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx   # Protected dashboard
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # App entry point
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   └── authController.js   # register/login/refresh/logout/profile logic
│   ├── middleware/
│   │   └── auth.js             # JWT verification & role guard
│   ├── models/
│   │   └── User.js             # Mongoose schema + bcrypt hooks
│   ├── routes/
│   │   └── authRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js               # App entry point
├── .env                        # Documents all env vars (see below)
├── .gitignore
├── LICENSE                     # MIT
├── package.json                # Root scripts (concurrently runs client + server)
└── README.md
```

---

## ✅ Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

---

## 🚀 Getting Started

### 1. Clone / unzip the project and install dependencies

From the project root:

```bash
npm run install:all
```

This installs the root `concurrently` dependency plus the `server` and `client`
dependencies in one go. (Equivalent to running `npm install` in `server/` and
`client/` individually.)

### 2. Configure environment variables

Two working `.env` files are already included with safe local defaults:

- `server/.env` — API port, MongoDB URI, JWT secrets, bcrypt rounds, allowed CORS origin
- `client/.env` — `VITE_API_URL` pointing at the API

**Before deploying anywhere beyond your machine, replace `JWT_SECRET` and
`JWT_REFRESH_SECRET` with long, random values** (e.g. `openssl rand -hex 64`).
The root `.env` file is a reference copy documenting every variable used by
both the client and the server — it isn't loaded automatically by either app.

### 3. Start MongoDB

Make sure a MongoDB instance is running and reachable at the URI configured
in `server/.env` (`MONGO_URI`).

### 4. Run the app

From the project root, start both the API and the client together:

```bash
npm run dev
```

- API: http://localhost:5000
- Client: http://localhost:5173

Or run them separately:

```bash
npm run server   # starts the Express API with nodemon
npm run client   # starts the Vite dev server
```

### 5. Try it out

1. Open http://localhost:5173 — you'll be redirected to `/login`.
2. Click **Create one** to register a new account.
3. On success you're redirected to the protected `/dashboard` route.
4. Refresh the page — your session persists via the stored access token and
   the silent refresh flow.
5. Use the user menu (top right) to **Log out**.

---

## 🔐 How authentication works

1. **Register / Login** — the server hashes/validates the password with
   `bcryptjs`, then issues:
   - an **access token** (JWT, short-lived, e.g. 1 day) returned in the JSON response
   - a **refresh token** (JWT, longer-lived, e.g. 7 days) set as an `httpOnly`,
     `sameSite=lax` cookie scoped to `/api/auth`
2. **Client storage** — the access token is kept in `localStorage` and attached
   to every API request as `Authorization: Bearer <token>` via an Axios
   request interceptor.
3. **Protected routes** — `GET /api/auth/profile` and any future protected
   endpoint use the `requireAuth` middleware, which verifies the JWT and loads
   the user from MongoDB.
4. **Silent refresh** — if a request comes back `401`, the Axios response
   interceptor automatically calls `POST /api/auth/refresh` (using the
   `httpOnly` cookie), stores the new access token, and retries the original
   request. If the refresh also fails, the user is redirected to `/login`.
5. **Logout** — clears the refresh token both server-side (removed from the
   user document) and client-side (cookie cleared, `localStorage` cleared).

> ⚠️ This project is a solid educational/starter foundation. For production,
> also consider: email verification, password-reset flows, HTTPS-only
> cookies, CSRF protection, stricter CORS, and centralized logging/monitoring.

---

## 📡 API Reference

| Method | Endpoint             | Auth required | Description                          |
|--------|-----------------------|:--------------:|--------------------------------------|
| POST   | `/api/auth/register`  | No             | Create a new account                 |
| POST   | `/api/auth/login`     | No             | Authenticate and receive tokens      |
| POST   | `/api/auth/refresh`   | Cookie only    | Get a new access token               |
| POST   | `/api/auth/logout`    | No             | Invalidate refresh token & cookie    |
| GET    | `/api/auth/profile`   | Yes (Bearer)   | Get the current user's profile       |
| GET    | `/api/health`         | No             | Health check                         |

**Register / Login request body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "supersecret1"
}
```

**Successful login/register response:**

```json
{
  "message": "Login successful",
  "accessToken": "<jwt>",
  "user": {
    "id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "lastLogin": "2026-09-09T12:00:00.000Z",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 🏗️ Building for production

```bash
npm run build:client     # builds the React app into client/dist
npm start                # runs the Express server (serve client/dist separately
                          # or add static-file serving in server.js as needed)
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
