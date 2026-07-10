// ── Load environment variables first ─────────────────────────────────────────
require("dotenv").config();

const express  = require("express");
const cors     = require("cors");

const connectDB            = require("./config/db");
const config               = require("./config/appConfig");
const employeeRoutes       = require("./routes/employeeRoutes");
const loggerMiddleware     = require("./middleware/loggerMiddleware");

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// Frontend is deployed on Vercel — allow its origin via CORS_ORIGIN env var
app.use(cors({
  origin:         config.corsOrigin,
  methods:        ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Employee Management API is running",
    version: "1.0.0",
    env: config.env,
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/employees", employeeRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Connect to DB then Start Server ──────────────────────────────────────────
connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`\x1b[32m✓\x1b[0m Server running on \x1b[36mhttp://localhost:${config.port}\x1b[0m`);
    console.log(`\x1b[32m✓\x1b[0m API:      \x1b[36mhttp://localhost:${config.port}/employees\x1b[0m`);
  });
});

module.exports = app;
