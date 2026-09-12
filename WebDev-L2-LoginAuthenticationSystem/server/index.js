require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// --- CORS (must come before other middleware) ---
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  return Boolean(origin && allowedOrigins.includes(origin));
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    optionsSuccessStatus: 200,
    preflightContinue: true,
  })
);

// --- Core middleware ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Routes ---
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Login Authentication API is running",
  });
});

// Explicit preflight handling keeps serverless OPTIONS requests deterministic.
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
  }
  return res.sendStatus(200);
});

app.use("/api/auth", authRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// Export the app for the Netlify function adapter.
module.exports = app;