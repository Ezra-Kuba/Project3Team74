"use client";

import { useState } from "react";

const starterMessages = [
  {
    role: "assistant",
    text: "Hi, I can help with the menu, ordering, and store questions.",
  },
];

export default function HomeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(starterMessages);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();

    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    setMessages((current) => [...current, { role: "user", text: message }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Chat request failed.");
      }

      setMessages((current) => [...current, { role: "assistant", text: data.reply }]);
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Something went wrong with the chat.";

      setMessages((current) => [
        ...current,
        { role: "assistant", text: `Sorry, I hit an error: ${messageText}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        className="chatbot-launcher"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? "Close Chat" : "Ask Gemini"}
      </button>

      {isOpen ? (
        <section className="chatbot-panel" aria-label="Gemini chatbot">
          <div className="chatbot-header">
            <h2 className="chatbot-title">Supa Yummi Assistant</h2>
            <p className="chatbot-subtitle">Powered by Gemini</p>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chatbot-message chatbot-message-${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {isLoading ? (
              <div className="chatbot-message chatbot-message-assistant">Thinking...</div>
            ) : null}
          </div>

          <form className="chatbot-form" onSubmit={sendMessage}>
            <textarea
              className="chatbot-input"
              rows="3"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about the menu or ordering..."
            />
            <button className="chatbot-send" type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </section>
      ) : null}
    </>
  );
}
