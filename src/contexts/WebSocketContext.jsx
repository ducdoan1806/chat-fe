import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const WebSocketContext = createContext();

export const WebSocketProvider = ({
  url = "http://127.0.0.1:5000",
  children,
}) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Tạo kết nối Socket.IO
    const socket = io(url);
    socketRef.current = socket;
    socket.on("connect", () => console.log("✅ Connected:", url));
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("disconnect", () => console.log("❌ Disconnected"));

    return () => socket.disconnect();
  }, [url]);

  const emitEvent = (type, msg) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(type, msg);
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, emitEvent }}>
      {children}
    </WebSocketContext.Provider>
  );
};
export default WebSocketContext;
