import React from 'react';

const ChatBox = ({ selectedUser, messages }) => {
  return (
    <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
      <h2>Chat with {selectedUser ? selectedUser.name : 'Select a user'}</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '80%', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '5px 0' }}>
            <strong>{msg.sender}: </strong>{msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;