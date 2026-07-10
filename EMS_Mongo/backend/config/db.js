const mongoose = require("mongoose");

/**
 * Establishes connection to MongoDB using the URI defined in environment variables.
 * Exits the process if the connection fails.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\x1b[32m✓\x1b[0m MongoDB connected: \x1b[36m${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error("\x1b[31m✗\x1b[0m MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
