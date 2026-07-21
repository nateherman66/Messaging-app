import { useState } from "react";
import "./Chat.css"


export default function Chat() {
   const conversations = [
        {
        id: 1,
        name: "Sarah",
        lastMessage: "Are we still on for tmr?"
        },
        {
        id: 2,
        name: "Alex",
        lastMessage: "That works for me"
        },
        {
        id: 3,
        name: "Group Study",
        lastMessage: "I uploaded the notes"
        },
    ];

    const [selectedChat, setSelectedChat] = useState(conversations[0]);

    return (
        <div className = "chat-page">
            <aside className = "chat-sidebar">
                <h2>Chats</h2>

                {conversations.map((conversations) => (
                <button
                key = {conversations.id}
                type = "button"
                className = "chat-list-item"
                onClick = {() => setSelectedChat(conversations)}
                >
                    <strong>{conversations.name}</strong>
                    <span>{conversations.lastMessage}</span>
                </button>
                ))}
            </aside>


            <main className="chat-main">
                <header className="chat-header">
                    <h2>{selectedChat.name}</h2>
                </header>

                <div className="messages">
                    <div className="received-message">Hey! How are you?</div>
                     <div className="sent-message">I'm doing well!</div>
                     <div className="received-message">
                        {selectedChat.lastMessage}
                     </div>
                    </div>

                    <form className="message-form">
                        <input type="text" placeholder="Message" />
                        <button type="submit">Send</button>
                    </form>
            </main>
        </div>
    )
}