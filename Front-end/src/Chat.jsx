import { useState } from "react";
import "./Chat.css";

export default function Chat() {
  const conversations = [
    {
      id: 1,
      name: "Sarah",
      lastMessage: "Are we still on for tomorrow?",
    },
    {
      id: 2,
      name: "Alex",
      lastMessage: "That works for me",
    },
    {
      id: 3,
      name: "Group Study",
      lastMessage: "I uploaded the notes",
    },
  ];

  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah",
      text: "Hey! How are you?",
    },
    {
      id: 2,
      sender: "Me",
      text: "I'm doing well!",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  function sendMessage(event) {
    event.preventDefault();

    if (newMessage.trim() === "") {
      return;
    }

    const message = {
      id: Date.now(),
      sender: "Me",
      text: newMessage,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  }

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <h2>Chats</h2>

        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            className="chat-list-item"
            onClick={() => setSelectedChat(conversation)}
          >
            <strong>{conversation.name}</strong>
            <span>{conversation.lastMessage}</span>
          </button>
        ))}
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <h2>{selectedChat.name}</h2>
        </header>

        <div className="messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.sender === "Me"
                  ? "sent-message"
                  : "received-message"
              }
            >
              {message.text}
            </div>
          ))}
        </div>

        <form className="message-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Message"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
          />

          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}