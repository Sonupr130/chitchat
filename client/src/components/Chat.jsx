import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/chatStore.js";
import axios from "axios";

const Chat = ({ userId, receiverId, groupId }) => {
  const { messages, sendMessage, receiveMessage, isTyping, sendTyping, receiveTyping } = useChatStore();
  const [message, setMessage] = useState("");

  useEffect(() => {
    receiveTyping();
  }, []);

  const handleTyping = () => {
    sendTyping(userId, receiverId, groupId);
  };

  useEffect(() => {
    receiveMessage();
    axios
      .get(`http://localhost:8000/api/chat/get-messages?senderId=${userId}&receiverId=${receiverId}`)
      .then((res) => useChatStore.setState({ messages: res.data }));
  }, [userId, receiverId, receiveMessage]);

  const handleSend = () => {
    sendMessage(userId, receiverId, message);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === userId ? "sent" : "received"}`}>
            {msg.message}
          </div>
        ))}
        {isTyping && <p className="typing-indicator">Typing...</p>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;



