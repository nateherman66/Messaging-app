import { useState } from "react";
import "./Chat.css";

export default function Chat() {
  const [conversations, setConversations] = useState([
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
  ]);

  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messagesByChat, setMessagesByChat] = useState({
     1: [
    {
      id: 1,
      sender: "Sarah",
      text: "Hey! How are you?",
    },
  ],
  2: [
    {
      id: 2,
      sender: "Alex",
      text: "That works for me",
    },
  ],
  3: [
    {
      id: 3,
      sender: "Group Study",
      text: "I uploaded the notes",
    },
  ],
});

  const [newMessage, setNewMessage] = useState("");
  const currentMessages = messagesByChat[selectedChat.id] || [];

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

    setMessagesByChat((previousMessages) => ({
      ...previousMessages,
      [selectedChat.id]: [
        ...(previousMessages[selectedChat.id] || []),
        message
      ],
    }));

    setNewMessage("");
  }

  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  function createNewChat(event) {
    event.preventDefault();

    if (newChatName.trim() === "") {
      return;
    }

    const newConversation = {
      id: Date.now(),
      name: newChatName,
      lastMessage: "No messages yet",
    };

    setConversations((previousConversations) => [
      ...previousConversations,
      newConversation
    ]);

    setMessagesByChat((previousMessages) => ({
      ...previousMessages,
      [newConversation.id]: [],
  }));

    setSelectedChat(newConversation);
    setNewChatName("");
    setShowNewChat(false);
  }

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <h2>Chats</h2>
        <button 
        type="button"
        className="new-chat-button"
        onClick={() => setShowNewChat(true)}>
          + New Chat
        </button>
        {showNewChat && (
          <form className="new-chat-form" onSubmit={createNewChat}>
            <input
            type="text"
            placeholder="Enter a username"
            value={newChatName}
            onChange={(event) => setNewChatName(event.target.value)}
            />

            <button type="submit">Create chat</button>

            <button
            type="button"
            onClick={() => setShowNewChat(false)}
            >
              Cancel
            </button>
          </form>
        )}

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
          {currentMessages.map((message) => (
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