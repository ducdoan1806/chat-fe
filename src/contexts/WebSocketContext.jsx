import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "./useUser";
const WebSocketContext = createContext();

export const WebSocketProvider = ({
  url = "http://127.0.0.1:5000",
  children,
}) => {
  const [messages, setMessages] = useState(null);
  const socketRef = useRef(null);
  const { user } = useUser();
  useEffect(() => {
    // Tạo kết nối Socket.IO
    const socket = io(url);
    socketRef.current = socket;
    socket.on("connect", () => console.log("✅ Connected:", url));
    socket.on("message", (msg) => {
      if (msg?.sender?.id !== user?.id) setMessages(msg);
    });
    socket.on("disconnect", () => console.log("❌ Disconnected"));

    return () => socket.disconnect();
  }, [url, user?.id]);

  const emitEvent = (type, msg) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(type, msg);
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, emitEvent, setMessages }}>
      {children}
    </WebSocketContext.Provider>
  );
};
export default WebSocketContext;
