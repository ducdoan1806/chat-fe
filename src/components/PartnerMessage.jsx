import { Avatar } from "antd";
import { getLastNameChar } from "../utils/util";
import dayjs from "dayjs";

const PartnerMessage = ({ message }) => {
  return (
    <div className="flex gap-2">
      <Avatar
        style={{
          backgroundColor: "#f56a00",
          verticalAlign: "middle",
          maxWidth: 32,
          minWidth: 32,
        }}
      >
        {getLastNameChar(message?.sender?.username || "")}
      </Avatar>
      <div className="text-gray-600 w-full">
        <p className="font-semibold text-sm truncate mb-1">
          {message?.sender?.username}
        </p>
        <div className="text-sm p-2 bg-white rounded-md shadow w-fit max-w-8/12 flex flex-col gap-1">
          <p className="text-wrap truncate text-sm">{message?.body}</p>
          <p className="text-xs text-gray-400 italic ml-auto text-nowrap">
            {dayjs(message?.created_at).format("YYYY-MM-DD HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerMessage;
