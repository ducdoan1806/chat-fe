import { Avatar, Button, Input, Spin } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import MyMessage from "../components/MyMessage";
import PartnerMessage from "../components/PartnerMessage";
import { useCallback, useEffect, useState } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/useUser";
import { useRooms } from "../contexts/useRooms";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const { setRooms } = useRooms();
  const [loading, setLoading] = useState([]);
  const { id } = useParams();
  const getMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/messages/?conversation=${id}`);
      setMessages(res.results.map((item) => ({ ...item, read: true })));
      const messagesUnread = res.results
        .filter((item) => item?.read === false)
        .map((item) => item?.id);
      if (messagesUnread.length !== 0)
        await api.post("/api/messages/mark-as-read/", {
          ids: messagesUnread,
        });
      setRooms((prev) => {
        const updated = prev.map((room) => {
          if (room.id === id) {
            room = {
              ...room,
              last_message: { ...room.last_message, read: true },
            };
          }
          return room;
        });
        return updated;
      });
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  }, [id, setRooms]);
  
  useEffect(() => {
    getMessages();
  }, [getMessages]);

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
          {loading && (
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
          />
          <Button icon={<IoSend />} type="primary" />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
