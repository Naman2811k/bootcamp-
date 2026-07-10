import { Mistral } from "@mistralai/mistralai";

// Created lazily (on first use) rather than at import time, so we don't
// read process.env.MISTRAL_API_KEY before dotenv.config() has run.
let ai;
function getClient() {
  if (!ai) {
    ai = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  }
  return ai;
}

/**
 * Sends the user's message to Mistral, along with prior conversation
 * history, and returns the model's reply as plain text.
 *
 * history format expected from the client:
 * [
 *   { role: "user", content: "hi" },
 *   { role: "assistant", content: "hello!" },
 *   ...
 * ]
 */
export async function getChatResponse(history = [], userMessage) {
  const messages = [...history, { role: "user", content: userMessage }];
  const response = await getClient().chat.complete({
    model: "mistral-large-latest",
    messages,
  });

  return response.choices[0].message.content;
}
