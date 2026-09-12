const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

function signAccessToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
}

const REFRESH_COOKIE_NAME = "refreshToken";

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/auth",
  });
}

// @route  POST /api/auth/register
// @desc   Create a new user account
// @access Public
async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      message: "Account created successfully",
      accessToken,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error("[auth] register error:", err);
    return res.status(500).json({ message: "Server error while registering user" });
  }
}

// @route  POST /api/auth/login
// @desc   Authenticate user and return tokens
// @access Public
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error("[auth] login error:", err);
    return res.status(500).json({ message: "Server error while logging in" });
  }
}

// @route  POST /api/auth/refresh
// @desc   Exchange a valid refresh token (cookie) for a new access token
// @access Public (requires refresh cookie)
async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.sub).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = signAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token expired or invalid" });
  }
}

// @route  POST /api/auth/logout
// @desc   Clear refresh token cookie and invalidate it server-side
// @access Private
async function logout(req, res) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await User.findByIdAndUpdate(decoded.sub, { $unset: { refreshToken: 1 } });
      } catch {
        // token already invalid/expired - nothing to clean up
      }
    }

    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("[auth] logout error:", err);
    return res.status(500).json({ message: "Server error while logging out" });
  }
}

// @route  GET /api/auth/profile
// @desc   Return the currently authenticated user's profile
// @access Private
async function getProfile(req, res) {
  return res.status(200).json({ user: req.user.toSafeObject() });
}

module.exports = { register, login, refresh, logout, getProfile };
