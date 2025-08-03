import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import "./Chatbot.css"; // Correct import for a regular CSS file

// Helper component for the typing animation
const TypingIndicator = () => (
  <div className="message ai typingIndicator">
    <span />
    <span />
    <span />
  </div>
);

// Main Chatbot Component
const Chatbot = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Refs for the chat window and body
  const chatWindowRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Function to get context from the current page
  const getPageContext = () => {
    const title = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const description = descriptionMeta ? descriptionMeta.content : "";
    const mainContent = document.querySelector("main, article, body");
    const textContent = mainContent
      ? mainContent.innerText.substring(0, 1500)
      : ""; // Limit context size

    return `The user is currently on a page with the following details:\n- Title: "${title}"\n- Description: "${description}"\n- Relevant Text Snippet: "${textContent}"`;
  };

  // Toggles chat window visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Effect to close chat on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const toggleButton = document.getElementById("chatbot-toggle-button");
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target) &&
        toggleButton &&
        !toggleButton.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Effect to auto-scroll to the latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handles sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newUserMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");
    setIsTyping(true);

    const lowercasedInput = newUserMessage.text.toLowerCase();
    let predefinedResponse = null;

    // --- Check for predefined questions ---
    if (
      lowercasedInput.includes("book an appointment") ||
      lowercasedInput.includes("how to book")
    ) {
      predefinedResponse =
        "To book an appointment, please search for a doctor by their name or specialty. Once you've found the right doctor, you can view their available slots and choose one that works for you.";
    } else if (
      lowercasedInput.includes("cancel an appointment") ||
      lowercasedInput.includes("how to cancel")
    ) {
      predefinedResponse =
        "You can cancel an existing appointment by navigating to the 'My Appointments' page. From there, you will see an option to cancel it.";
    } else if (lowercasedInput.includes("reschedule")) {
      predefinedResponse =
        "To reschedule an appointment, please go to the 'My Appointments' page. You will find the option to reschedule next to your appointment details.";
    } else if (
      lowercasedInput.includes("search for doctor") ||
      lowercasedInput.includes("filter by specialty")
    ) {
      predefinedResponse =
        "You can easily search for doctors and filter them by their specialty on our platform to find the care you need.";
    }

    // If a predefined response is found, show it and skip the API call
    if (predefinedResponse) {
      const aiResponse = {
        id: Date.now() + 1,
        text: predefinedResponse,
        sender: "ai",
      };
      setTimeout(() => {
        // Simulate thinking delay
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
        setIsTyping(false);
      }, 600);
      return;
    }

    // --- If no predefined response, proceed with Gemini API call ---
    const conversationHistory = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    let contextPrompt = "";
    if (
      lowercasedInput.includes("this page") ||
      lowercasedInput.includes("explain this")
    ) {
      contextPrompt = getPageContext();
    }

    const fullPrompt = `${contextPrompt}\n\nUser query: ${newUserMessage.text}`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_KEY; // This will be handled by the environment, do not add a key here.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          ...conversationHistory,
          { role: "user", parts: [{ text: fullPrompt }] },
        ],
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();

      let botResponseText =
        "Sorry, I couldn't get a response. Please try again.";
      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content.parts.length > 0
      ) {
        botResponseText = data.candidates[0].content.parts[0].text;
      }

      const aiResponse = {
        id: Date.now() + 1,
        text: botResponseText.replace(/\*\*/g, ""),
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, something went wrong. Please check your connection and try again later.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');`}</style>
      {/* Floating button to toggle the chat window */}
      <button
        id="chatbot-toggle-button"
        className="chatToggleButton"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* The chat window */}
      {isOpen && (
        <div ref={chatWindowRef} className="chatWindow">
          <div className="chatHeader">
            <span>Prescripto Bot</span>
            <button
              onClick={toggleChat}
              className="closeButton"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          <div ref={chatBodyRef} className="chatBody">
            {messages.length === 0 ? (
              <p className="initialMessage">Hello! How can I help you today?</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))
            )}
            {isTyping && <TypingIndicator />}
          </div>
          <form onSubmit={handleSendMessage} className="chatInputForm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chatInput"
              disabled={isTyping}
              aria-label="Chat input"
            />
            <button
              type="submit"
              className="sendButton"
              disabled={isTyping || input.trim() === ""}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
