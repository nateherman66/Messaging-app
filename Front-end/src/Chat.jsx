import { useState, useEffect } from "react";
import "./Chat.css";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const currentMessages = selectedChat
    ? messagesByChat[selectedChat._id] || []
    : [];

  useEffect(() => {
    async function loadConversations() {
      try {
        const response = await fetch(
          "http://localhost:5000/conversations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load conversations"
          );
        }

        setConversations(data);

        if (data.length > 0) {
          setSelectedChat(data[0]);
        }
      } catch (error) {
        console.error("Load conversations error:", error);
      }
    }

    if (token) {
      loadConversations();
    }
  }, [token]);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedChat) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/messages/${selectedChat._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load messages"
          );
        }

        setMessagesByChat((previousMessages) => ({
          ...previousMessages,
          [selectedChat._id]: data,
        }));
      } catch (error) {
        console.error("Load messages error:", error);
      }
    }

    if (token) {
      loadMessages();
    }
  }, [selectedChat, token]);

  async function sendMessage(event) {
    event.preventDefault();

    const trimmedMessage = newMessage.trim();

    if (!selectedChat || !currentUser || !trimmedMessage) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversation: selectedChat._id,
            text: trimmedMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not send message"
        );
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
      console.error("Send message error:", error);
    }
  }

  async function createNewChat(event) {
    event.preventDefault();

    const username = newChatName.trim();

    if (!username) {
      return;
    }

    try {
      const userResponse = await fetch(
        `http://localhost:5000/users/search?username=${encodeURIComponent(
          username
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const foundUser = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(
          foundUser.message || "User not found"
        );
      }

      const response = await fetch(
        "http://localhost:5000/conversations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: foundUser.username,
            members: [foundUser._id],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not create conversation"
        );
      }

      setConversations((previousConversations) => {
        const alreadyListed = previousConversations.some(
          (conversation) => conversation._id === data._id
        );

        if (alreadyListed) {
          return previousConversations;
        }

        return [...previousConversations, data];
      });

      setMessagesByChat((previousMessages) => ({
        ...previousMessages,
        [data._id]: previousMessages[data._id] || [],
      }));

      setSelectedChat(data);
      setNewChatName("");
      setShowNewChat(false);
    } catch (error) {
      console.error("Create chat error:", error);
    }
  }

  function getConversationName(conversation) {
    const otherUser = conversation.members?.find(
      (member) => member._id !== currentUser?._id
    );
    return otherUser?.username || conversation.name || "Unknown user";
  }

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <h2>Chats</h2>

        <button
          type="button"
          className="new-chat-button"
          onClick={() => setShowNewChat(true)}
        >
          + New Chat
        </button>

        {showNewChat && (
          <form
            className="new-chat-form"
            onSubmit={createNewChat}
          >
            <input
              type="text"
              placeholder="Enter a username"
              value={newChatName}
              onChange={(event) =>
                setNewChatName(event.target.value)
              }
            />

            <button type="submit">Create chat</button>

            <button
              type="button"
              onClick={() => {
                setShowNewChat(false);
                setNewChatName("");
              }}
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
            <strong>{getConversationName(conversation)}</strong>
            <span>{conversation.lastMessage}</span>
          </button>
        ))}
      </aside>

      <main className="chat-main">
        {selectedChat ? (
          <>
            <header className="chat-header">
              <h2>{getConversationName(selectedChat)}</h2>
            </header>

            <div className="messages">
              {currentMessages.map((message) => (
                <div
                  key={message._id || message.id}
                  className={
                    message.sender?._id === currentUser?._id
                      ? "sent-message"
                      : "received-message"
                  }
                >
                  <strong>
                    {message.sender?.username ||
                      "Unknown user"}
                  </strong>

                  <div>{message.text}</div>
                </div>
              ))}
            </div>

            <form
              className="message-form"
              onSubmit={sendMessage}
            >
              <input
                type="text"
                placeholder="Message"
                value={newMessage}
                onChange={(event) =>
                  setNewMessage(event.target.value)
                }
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