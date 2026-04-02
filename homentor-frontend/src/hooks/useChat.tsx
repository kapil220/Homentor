// useChat.ts (Custom hook)
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export function useChat(userId: string) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join", userId);
    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.disconnect();
  }, [userId]);

  const sendMessage = (receiverId: string, content: string) => {
    socket.emit("private-message", { sender: userId, receiver: receiverId, content });
  };

  return { messages, sendMessage };
}
