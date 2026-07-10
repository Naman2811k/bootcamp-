function HeroSection({ onOpenChat }) {
  return (
    <section className="hero">
      <span className="hero-badge">Powered by Mistral AI</span>
      <h1>Welcome to CampusAI</h1>
      <p className="hero-subtitle">
        An intelligent chatbot built with React, Node.js &amp; the Mistral API.
        Ask anything — by text or voice.
      </p>

      <div className="hero-chat-box" onClick={onOpenChat}>
        <span className="hero-chat-icon">✦</span>
        <h2>Talk to the AI Assistant</h2>
        <p>Click to start a conversation</p>
      </div>
    </section>
  );
}

export default HeroSection;
