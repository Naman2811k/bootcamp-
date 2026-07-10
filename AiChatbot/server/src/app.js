import "./config/env.js";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin:process.env.FRONTEND_URI || 'http://localhost:5173',
  credentials:true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Chatbot server is running.");
});

app.use("/api", chatRoutes);

if (!process.env.MISTRAL_API_KEY) {
  console.warn(
    "WARNING: MISTRAL_API_KEY is not set. Copy .env.example to .env and add your key."
  );
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
