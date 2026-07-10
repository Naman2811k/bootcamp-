import { getChatResponse } from "../services/mistral.service.js";

export async function handleChat(req, res) {
  const { message, history } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const reply = await getChatResponse(history || [], message);
    return res.json({ reply });
  } catch (err) {
    console.error("Mistral API error:", err.message);
    return res.status(500).json({
      error: "Something went wrong while talking to Mistral. Check your API key and try again.",
    });
  }
}
