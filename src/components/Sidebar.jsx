import { Button, Empty, Input, Skeleton, Tooltip } from "antd";
import { LuMessageCirclePlus } from "react-icons/lu";
import RoomItem from "./RoomItem";
import { useRooms } from "../contexts/useRooms";

const Sidebar = () => {
  const { rooms, loading } = useRooms();
  return (
    <div className="max-w-[350px] min-w-[350px] flex flex-1 p-2">
      <div className="bg-white shadow-md flex flex-col flex-1 overflow-hidden rounded-md">
        <div className="flex justify-between items-center p-2">
          <div className="flex gap-1 items-end">
            <span className="text-[#15236d] font-bold text-4xl">MES</span>
            <span className="text-lg italic font-semibold text-gray-600">
              Chat
            </span>
          </div>
          <Tooltip title="Add new message">
            <Button
              variant="text"
              shape="circle"
              color="default"
              style={{ color: "#15236d" }}
              icon={<LuMessageCirclePlus size={20} />}
            />
          </Tooltip>
        </div>
        <div className="px-2">
          <Input.Search placeholder="Search..." />
        </div>
        <div className="flex flex-col overflow-auto flex-1 mt-2">
          {loading ? (
            <div className="p-2">
              <Skeleton active />
            </div>
          ) : (
            rooms.map((room) => <RoomItem key={room.id} room={room} />)
          )}
          {rooms.length === 0 && (
            <div className="p-2">
              <Empty description="No chat" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
