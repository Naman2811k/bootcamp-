/**
 * Centralized application configuration.
 * All values are sourced from environment variables loaded by dotenv.
 *
 * CORS_ORIGIN supports a comma-separated list of allowed origins, e.g.:
 *   CORS_ORIGIN=https://myapp.vercel.app,https://myapp.onrender.com
 */

// Parse comma-separated origins into an array (or keep as a string for single origin)
// Accepts both CORS_ORIGIN and CORS_ORIGIN_PROD env var names, and strips trailing slashes
const rawOrigins = (process.env.CORS_ORIGIN || process.env.CORS_ORIGIN_PROD || "http://localhost:5173").trim();
const corsOrigin = rawOrigins.includes(",")
  ? rawOrigins.split(",").map((o) => o.trim().replace(/\/+$/, ""))
  : rawOrigins.replace(/\/+$/, "");

const config = {
  env:         process.env.NODE_ENV      || "development",
  port:        parseInt(process.env.PORT || "5000", 10),
  mongoUri:    process.env.MONGODB_URI,
  corsOrigin,
  jwt: {
    secret:    process.env.JWT_SECRET    || "changeme",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  logLevel:    process.env.LOG_LEVEL     || "dev",
};

module.exports = config;
