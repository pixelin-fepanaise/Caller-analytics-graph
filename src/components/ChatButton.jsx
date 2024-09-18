import { useState } from "react";
import Chatbot from "../assets/chatbot.svg"; // Import SVG as an image source
import "./ChatButton.css";

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      <button className="chat-btn" onClick={toggleChat}>
        <img src={Chatbot} alt="Chatbot" width="36px" height="36px" />
      </button>
      {isChatOpen && (
        <div className="chat-container">
          <div className="chat-box">
            <div className="chat-header">
              <span>Chat</span>
              <button className="close-btn" onClick={toggleChat}>
                &times;
              </button>
            </div>
            <div className="chat-body">
              <p>Hi there! How can I help you?</p>
            </div>
            <div className="chat-footer">
              <input type="text" placeholder="Type your message..." />
              <button type="submit">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatButton;
