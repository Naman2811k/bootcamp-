/**
 * ChatWindow.jsx — Main chat panel (messages + input).
 * Redesigned with a ChatGPT/Claude-style layout.
 */
import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../services/chatApi.js";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition.js";
import { speakText } from "../hooks/useSpeechSynthesis.js";

/* ── Suggested starter prompts shown on the welcome screen ── */
const STARTER_PROMPTS = [
  {
    icon: "🎓",
    title: "Explain a concept",
    sub: "Break down a complex academic topic",
    prompt: "Explain the concept of machine learning in simple terms.",
  },
  {
    icon: "✍️",
    title: "Write an essay",
    sub: "Draft structured academic content",
    prompt: "Write a short essay on the importance of renewable energy.",
  },
  {
    icon: "🔍",
    title: "Research help",
    sub: "Find relevant information fast",
    prompt: "What are the latest developments in quantum computing?",
  },
  {
    icon: "💡",
    title: "Brainstorm ideas",
    sub: "Get creative suggestions and plans",
    prompt: "Give me 5 innovative project ideas related to AI in education.",
  },
];

/* ── Build Mistral-compatible history array ── */
const buildHistory = (msgs) => {
  const firstUserIndex = msgs.findIndex((m) => m.role === "user");
  if (firstUserIndex === -1) return [];
  return msgs.slice(firstUserIndex).map((m) => ({
    role: m.role === "model" ? "assistant" : m.role,
    content: m.text,
  }));
};

function ChatWindow({ conversation, onMessagesUpdate }) {
  const [messages, setMessages] = useState(conversation?.messages ?? []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  /* Sync messages from parent (when switching conversations) */
  useEffect(() => {
    setMessages(conversation?.messages ?? []);
  }, [conversation?.id]);

  /* Auto-scroll to bottom on new message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  }, [input]);

  /* ── Core send handler ── */
  const handleSend = async (textToSend) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;

    const historyBeforeThis = buildHistory(messages);
    const userMsg = { role: "user", text, timestamp: Date.now() };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    onMessagesUpdate?.(nextMessages);

    try {
      const reply = await sendMessage(text, historyBeforeThis);
      const modelMsg = { role: "model", text: reply, timestamp: Date.now() };
      const finalMessages = [...nextMessages, modelMsg];
      setMessages(finalMessages);
      onMessagesUpdate?.(finalMessages);
      if (voiceReplyEnabled) speakText(reply);
    } catch {
      const errMsg = { role: "model", text: "⚠️ Sorry, I couldn't reach the server. Is it running?", timestamp: Date.now() };
      const finalMessages = [...nextMessages, errMsg];
      setMessages(finalMessages);
      onMessagesUpdate?.(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Voice recognition ── */
  const { startListening, isListening, isSupported } = useSpeechRecognition((transcript) => {
    setInput(transcript);
    handleSend(transcript);
  });

  /* ── Keyboard handler — Enter sends, Shift+Enter newline ── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* ── Welcome screen / Empty state ── */}
      {isEmpty ? (
        <div className="welcome-screen">
          {/* Ambient glow orb */}
          <div className="welcome-orb" aria-hidden="true" />

          <div className="welcome-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>

          <h1 className="welcome-title">How can I help you today?</h1>
          <p className="welcome-subtitle">
            Your AI assistant powered by Mistral. Ask anything — by typing or by voice.
          </p>

          <div className="welcome-prompts">
            {STARTER_PROMPTS.map((p) => (
              <button
                key={p.title}
                className="welcome-prompt-card"
                onClick={() => handleSend(p.prompt)}
              >
                <span className="welcome-prompt-icon">{p.icon}</span>
                <div className="welcome-prompt-title">{p.title}</div>
                <div className="welcome-prompt-sub">{p.sub}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Messages area ── */
        <div className="messages-area">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role}`}>
              <div className="message-inner">
                {msg.role === "model" && (
                  <div className="message-avatar-row">
                  <div className="message-avatar">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    <path d="M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" />
                  </svg>
                </div>
                    <span className="message-sender-label">CampusAI</span>
                  </div>
                )}
                <div className="message-bubble">{msg.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="typing-row">
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* ── Input area ── */}
      <div className="input-area">
        <div className="input-box">
          <div className="input-box-inner">
            <textarea
              ref={textareaRef}
              className="input-textarea"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening…" : "Message CampusAI…"}
              disabled={isLoading}
              aria-label="Message input"
            />
            <div className="input-actions">
              {isSupported && (
                <button
                  className={`mic-btn${isListening ? " listening" : ""}`}
                  onClick={startListening}
                  title={isListening ? "Listening…" : "Click to speak"}
                  disabled={isLoading}
                  aria-label="Voice input"
                >
                  🎤
                </button>
              )}
              <button
                className="send-btn"
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Voice toggle + hint */}
        <div className="voice-toggle-row">
          <label className="voice-toggle" title="Toggle text-to-speech replies">
            <input
              type="checkbox"
              checked={voiceReplyEnabled}
              onChange={(e) => setVoiceReplyEnabled(e.target.checked)}
            />
            <span className="voice-toggle-switch" />
            <span className="voice-toggle-label">Read replies aloud</span>
          </label>
        </div>
        <p className="input-hint">CampusAI can make mistakes. Consider checking important info.</p>
      </div>
    </>
  );
}

export default ChatWindow;
