import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

// Helper component for rendering the bot's thinking animation
const LoadingDots = () => (
  <div className="loading-dots">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);

// Main Chatbot Component
const Chatbot = () => {
  // State management for the chatbot
  const [isOpen, setIsOpen] = useState(false); // Controls chat window visibility
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your Prescripto assistant. How can I help you today? You can ask me about doctors, appointments, or general health questions.",
      isUser: false,
    },
  ]); // Stores the conversation history
  const [inputValue, setInputValue] = useState(""); // Current value of the input field
  const [isTyping, setIsTyping] = useState(false); // To show a 'typing' indicator

  // Ref for the chat body to auto-scroll to the latest message
  const chatBodyRef = useRef(null);

  // API configuration
  const apiKey =import.meta.env.VITE_GEMINI_KEY // Leave this empty, it will be handled by the environment
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Effect to scroll down when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Toggles the chatbot window open/closed
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Handles sending a message to the Gemini API
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Add user's message to the chat
    const userMessage = { text: inputValue, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true); // Show typing indicator

    try {
      // Prepare the payload for the Gemini API
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: inputValue }],
          },
        ],
      };

      // Make the API call
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      let botResponseText =
        "Sorry, I couldn't get a response. Please try again.";
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        // Get the raw text and remove the ** markdown for bolding
        const rawText = result.candidates[0].content.parts[0].text;
        botResponseText = rawText.replace(/\*\*/g, "");
      }

      // Add bot's response to the chat
      const botMessage = { text: botResponseText, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      // Add an error message to the chat if the API call fails
      const errorMessage = {
        text: "Sorry, something went wrong. Please check your connection or try again later.",
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  };

  // Handles the key press event to send message on 'Enter'
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div>
      {/* The floating button to open/close the chatbot */}
      <button onClick={toggleChatbot} className="chatbot-toggle-button">
        {/* Simple chat icon using SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {/* The chat window, which shows only if 'isOpen' is true */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h2>Prescripto Bot</h2>
            <button onClick={toggleChatbot} className="chatbot-close-button">
              &times;
            </button>
          </div>
          <div className="chatbot-body" ref={chatBodyRef}>
            {/* Map through messages and render them */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.isUser ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
            {/* Show loading indicator when the bot is 'typing' */}
            {isTyping && (
              <div className="chat-message bot">
                <LoadingDots />
              </div>
            )}
          </div>
          <div className="chatbot-footer">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              aria-label="Type a message"
            />
            <button onClick={handleSendMessage} aria-label="Send message">
              {/* Send icon using SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
