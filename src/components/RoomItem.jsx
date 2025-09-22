import { Avatar, Badge } from "antd";
import { NavLink } from "react-router-dom";
import { getLastNameChar } from "../utils/util";
import { useUser } from "../contexts/useUser";

const RoomItem = ({ room }) => {
  const { user } = useUser();
  const partnerName =
    room?.participants.length === 2
      ? room?.participants?.find((p) => p.id !== user?.id).username
      : room?.name || "";
  const isRead = room?.new_message_count === 0;
  return (
    <NavLink
      to={`/${room?.id}`}
      className={({ isActive }) =>
        `px-2 py-3 flex items-center gap-2 transition-all cursor-pointer hover:bg-blue-50 ${
          isActive ? "bg-blue-50" : ""
        }`
      }
    >
      <Avatar
        style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
        size="large"
      >
        {getLastNameChar(partnerName.toUpperCase())}
      </Avatar>
      <div className="text-gray-600 flex-1">
        <p
          className={`${
            isRead ? "font-semibold" : "font-bold"
          } text-sm truncate`}
        >
          {partnerName}
        </p>
        <p className={`${isRead ? "" : "font-semibold"} text-xs truncate`}>
          {room?.last_message?.body || ""}
        </p>
      </div>
      {!isRead && <Badge count={room?.new_message_count || 0} />}
    </NavLink>
  );
};

export default RoomItem;
