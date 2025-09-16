import dayjs from "dayjs";

const MyMessage = ({ message }) => {
  return (
    <div className="ml-auto p-2 bg-blue-500 text-white rounded-md shadow max-w-7/12 flex flex-col gap-1">
      <p className="text-sm text-wrap truncate">{message?.body}</p>
      <p className="text-xs italic">
        {dayjs(message?.created_at).format("YYYY-MM-DD HH:mm")}
      </p>
    </div>
  );
};

export default MyMessage;
