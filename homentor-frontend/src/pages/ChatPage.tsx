import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8080"); // change if different

const ChatPage = ( ) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUserPhone = "9630709988"
  const chatPartnerPhone = localStorage.getItem("mentorNumber")

  useEffect(() => {
    // ✅ Register this user with socket
    socket.emit("register", currentUserPhone);

    // ✅ Get chat history
    axios
      .post(`http://localhost:5000/api/chat/history`, {
        user1: currentUserPhone,
        user2 : chatPartnerPhone
      })
      .then((res) => setChatMessages(res.data))
      .catch((err) => console.error("Failed to fetch chat history", err));

    // ✅ Listen for incoming messages
    socket.on("receive-message", (data) => {
      setChatMessages((prev) => [...prev, { sender: data.sender, message: data.message }]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [currentUserPhone, chatPartnerPhone]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      sender: currentUserPhone,
      receiver: chatPartnerPhone,
      message,
    };

    socket.emit("send-message", newMsg);
    setChatMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-8">
      <div className="h-96 overflow-y-auto p-4 border border-gray-200 rounded">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded ${
              msg.sender === currentUserPhone ? "bg-blue-200 text-right ml-auto" : "bg-gray-100 text-left mr-auto"
            } max-w-[70%]`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded-l"
          value={message}
          placeholder="Type your message"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
