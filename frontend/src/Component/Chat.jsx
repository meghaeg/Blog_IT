import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

const socket = io("https://blog-it-67ma.onrender.com");

function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("livechat");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("message");
  }, []);

  const joinChat = () => {
    if (!username.trim()) return;
    socket.emit("join", { username, room });
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send_message", { text: message });
    setMessage("");
  };

  const leaveChat = () => {
    socket.emit("leave", { username, room });
    setJoined(false);
    setMessages([]);
    navigate("/");
  };

  return (
    <div className="chat-page">
      {!joined ? (
        <div className="join-card">
          <h2 className="join-title">Connect, Discuss Blog !</h2>

          <input
            className="join-input"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="join-input"
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <button className="join-btn" onClick={joinChat}>
            Join
          </button>
        </div>
      ) : (
        <div className="chat-box">
          <div className="chat-header">
            <span>Room: {room}</span>
            <button className="leave-btn" onClick={leaveChat}>
              Leave
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${
                  msg.user === username ? "sent" : "received"
                }`}
              >
                <span className="bubble-user">{msg.user}</span>
                <p>{msg.text}</p>
                <span className="bubble-time">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="chat-input-bar">
            <input
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
