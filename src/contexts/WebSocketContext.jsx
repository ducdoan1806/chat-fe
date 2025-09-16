import { createContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({
  url = "ws://127.0.0.1:8000/ws/chat/1/",
  children,
}) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ Connected:", url);
    ws.onmessage = (event) => setMessages((prev) => [...prev, event.data]);
    ws.onclose = () => console.log("❌ Disconnected");

    return () => ws.close();
  }, [url]);

  const sendMessage = (msg) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
export default WebSocketContext;
