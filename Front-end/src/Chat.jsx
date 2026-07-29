import { useState, useEffect } from "react";
import "./Chat.css";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [newMessage, setNewMessage] = useState("");
   const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");


  const currentMessages = selectedChat 
  ? messagesByChat[selectedChat._id] || []
  : [];

  useEffect(() => {
    async function loadConversations() {
      try {
        const response = await fetch("http://localhost:5000/conversations");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setConversations(data);

        if (data.length > 0) {
          setSelectedChat(data[0]);
        }
      } catch (error) {
        console.error("Load conversations error:", error);
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedChat) return;

      try {
        const response = await fetch(
            `http://localhost:5000/messages/${selectedChat._id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load message");
        }

        setMessagesByChat((previousMessages) => ({
          ...previousMessages,
          [selectedChat._id]: data,
        }));
      } catch (error) {
        console.error("Load messages error:", error);
      }
    }

    loadMessages();
  }, [selectedChat]);

  async function sendMessage(event) {
    event.preventDefault();

    if(!selectedChat || newMessage.trim() === "") {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          conversation: selectedChat._id,
          sender: "6a2b62a678be12e3114e7084",
          text: newMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not send message");
      }

      setMessagesByChat((previousMessages) => ({
        ...previousMessages,
        [selectedChat._id]: [
          ...(previousMessages[selectedChat._id] || []),
          data,
        ],
      }));

      setNewMessage("");
    } catch (error) {
      console.error("send message error:", error);
    }

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
      [selectedChat._id]: [
        ...(previousMessages[selectedChat._id] || []),
        message
      ],
    }));

    setNewMessage("");
  }

 

  const createNewChat = async (event) => {
    event.preventDefault();

    if (!newChatName.trim()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newChatName,
          members: ["6a2b62a678be12e3114e7084"],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create conversation");
      }

      setConversations((previousConversations) => [
        ...previousConversations,
        data,
      ]);

      setMessagesByChat((previousMessages) => ({
        ...previousMessages,
        [data._id]: [],
    }));

    setSelectedChat(data);
    setNewChatName("");
    setShowNewChat(false);
    } catch (error) {
      console.error("Create chat error:", error);
    }
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
            key={conversation._id}
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
        {selectedChat ? (
          <>
        <header className="chat-header">
          <h2>{selectedChat?.name || "Select a chat"}</h2>
        </header>

        <div className="messages">
          {currentMessages.map((message) => (
            <div
              key={message._id || message.id}
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
        </>
        ) : (
          <p>No chat selected</p>
        )}
      </main>
    </div>
  );
}