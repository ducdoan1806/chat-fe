import { Avatar, Button, Input, message, Spin } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import MyMessage from "../components/MyMessage";
import PartnerMessage from "../components/PartnerMessage";
import { useCallback, useEffect, useState } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/useUser";
import { useRooms } from "../contexts/useRooms";
import { useWebSocket } from "../contexts/useWebSocket";
import { setError } from "../utils/util";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { emitEvent } = useWebSocket();
  const { user } = useUser();
  const { setRooms } = useRooms();
  const [loading, setLoading] = useState({ get: false, send: false });
  const { id } = useParams();
  const getMessages = useCallback(async () => {
    setLoading((prev) => ({ ...prev, get: true }));
    try {
      await api.get(`/api/conversations/${id}/`);
      const res = await api.get(`/api/messages/?conversation=${id}`);

      setRooms((prev) => {
        const updated = prev.map((room) => {
          if (room.id === Number(id)) {
            room.new_message_count = 0;
          }
          return room;
        });
        return updated;
      });
      setMessages(res.results.map((item) => ({ ...item, read: true })));
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading((prev) => ({ ...prev, get: false }));
    }
  }, [id, setRooms]);
  const sendMessage = async () => {
    setLoading((prev) => ({ ...prev, send: true }));
    try {
      const res = await api.post("/api/messages/", {
        conversation: id,
        sender_id: user?.id,
        body: messageInput,
      });
      setMessages((prev) => [res, ...prev]);
      setRooms((prev) => {
        const updated = prev.map((room) => {
          if (room.id === id) {
            room = {
              ...room,
              last_message: res,
            };
          }
          return room;
        });
        return updated;
      });
      setMessageInput("");
    } catch (error) {
      message.error(`Error: ${setError(error)} `);
    } finally {
      setLoading((prev) => ({ ...prev, send: false }));
    }
  };
  useEffect(() => {
    getMessages();
  }, [getMessages]);

  useEffect(() => {
    if (!id || !user?.id) return;
    emitEvent("join_room", { roomId: id, userId: user?.id });
    return () => emitEvent("leave_room", { roomId: id, userId: user?.id });
  }, [emitEvent, id, user?.id]);
  return (
    <div className="flex flex-1 py-2 pr-2">
      <div className="bg-white shadow-md rounded-md flex flex-col flex-1 overflow-hidden">
        <div className="shadow-md p-2 flex gap-1 items-center justify-between">
          <div className="flex items-center gap-2 ">
            <Avatar
              style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
              size="large"
            >
              Đ
            </Avatar>
            <div className="text-gray-600 flex-1">
              <p className="font-semibold text-base truncate">Đoàn Minh Đức</p>
              <p className="text-xs truncate">ducdoan1806@gmail.com</p>
            </div>
          </div>
          <Button
            variant="text"
            shape="circle"
            color="default"
            style={{ color: "#15236d" }}
            icon={<HiOutlineDotsHorizontal size={20} />}
          />
        </div>
        <div className="flex flex-1 flex-col-reverse gap-2 px-2 py-3 overflow-auto bg-gray-100">
          {loading.get && (
            <div className="flex justify-center p-2">
              <Spin />
            </div>
          )}
          {messages.map((message) =>
            message?.sender?.id === user?.id ? (
              <MyMessage key={message?.id} message={message} />
            ) : (
              <PartnerMessage key={message?.id} message={message} />
            )
          )}
        </div>
        <div className="p-2 flex items-start gap-1 shadow">
          <Input.TextArea
            autoSize={{ maxRows: 5, minRows: 1 }}
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <Button
            icon={<IoSend />}
            type="primary"
            loading={loading.send}
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
